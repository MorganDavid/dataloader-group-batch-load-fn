// @ts-check
import { groupBatchLoadFn } from "../src/groupBatchLoadFn";
import { expect, test, describe, vi } from "vitest";
import DataLoader from "dataloader";
import objectHash from "object-hash";

const products = {
  1: { id: 1, status: "BOUGHT", orderId: 1 },
  2: { id: 2, status: "SOLD", orderId: 1 },
  3: { id: 3, status: "SOLD", orderId: 1 },
  4: { id: 4, status: "BOUGHT", orderId: 2 },
  5: { id: 5, status: "SOLD", orderId: 2 },
  6: { id: 6, status: "SOLD", orderId: 3 },
  7: { id: 7, status: "SOLD", orderId: 3 },
  8: { id: 8, status: "SOLD", orderId: 4 },
  9: { id: 8, status: "SOLD", orderId: 4 },
};

const getProductsByOrderIdAndStatusResolver = async (keys, staticFields) => {
  // a query to the datastore would go here.
  // static fields are fields which are the same for every value of `keys`
  const resultsInTheSameOrderAsKeys = keys.map((key) =>
    Object.values(products).filter(
      (product) =>
        product.status === staticFields.status && key.id === product.orderId
    )
  );
  return resultsInTheSameOrderAsKeys;
};

const mockGetProductsByOrderIdAndStatusResolver = vi
  .fn()
  .mockImplementation(getProductsByOrderIdAndStatusResolver);

describe("groupedBatchLoadFn", () => {
  test("should group and resolve keys correctly", async () => {
    const options = {
      getStaticFields: ({ status }) => ({
        status,
      }),
    };
    const batchLoadFunction = groupBatchLoadFn(
      mockGetProductsByOrderIdAndStatusResolver,
      options
    );

    const keys = [
      { id: 1, status: "BOUGHT" },
      { id: 2, status: "BOUGHT" },
      { id: 3, status: "SOLD" },
      { id: "dones't exist", status: "BOUGHT" },
      { id: "dones't exist", status: "DOESNT_EXIST" },
      { id: 1, status: "BOUGHT" },
    ];
    const results = await batchLoadFunction(keys);

    expect(results).toEqual([
      [{ id: 1, status: "BOUGHT", orderId: 1 }],
      [{ id: 4, status: "BOUGHT", orderId: 2 }],
      [
        { id: 6, status: "SOLD", orderId: 3 },
        { id: 7, status: "SOLD", orderId: 3 },
      ],
      [],
      [],
      [{ id: 1, status: "BOUGHT", orderId: 1 }],
    ]);

    expect(mockGetProductsByOrderIdAndStatusResolver).toHaveBeenCalledTimes(3);
    expect(mockGetProductsByOrderIdAndStatusResolver).toHaveBeenCalledWith(
      [
        { id: 1, status: "BOUGHT" },
        { id: 2, status: "BOUGHT" },
        { id: "dones't exist", status: "BOUGHT" },
        { id: 1, status: "BOUGHT" },
      ],
      { status: "BOUGHT" }
    );
    expect(mockGetProductsByOrderIdAndStatusResolver).toHaveBeenCalledWith(
      [{ id: 3, status: "SOLD" }],
      {
        status: "SOLD",
      }
    );
  });

  test("should return an error when the provided resolve function does not return an array with the same length as keys", async () => {
    const options = {
      getStaticFields: ({ status }) => ({
        status,
      }),
    };

    // returns results which don't match the length of keys
    const invalidResolver = async () => [1];

    const batchLoadFunction = groupBatchLoadFn(invalidResolver, options);

    const keys = [
      { id: 1, status: "BOUGHT" },
      { id: 2, status: "BOUGHT" },
      { id: 3, status: "BOUGHT" },
      { id: 4, status: "SOLD" },
    ];

    await expect(batchLoadFunction(keys)).rejects.toEqual(
      expect.objectContaining({
        message:
          "the length of the array returned by resolve() must be equal to the length of the keys array",
      })
    );
  });

  test("should behave normally when the keys are not objects", async () => {
    const options = {
      // this is just a normal dataloader batchLoadFn now, so we don't want to group anything.
      getStaticFields: () => 1,
    };

    const normalResolver = vi.fn().mockImplementation(async (keys) => {
      return keys;
    });

    const batchLoadFunction = groupBatchLoadFn(normalResolver, options);

    const keys = [1, 2, 3, 4, 5, 6];

    const results = await batchLoadFunction(keys);

    expect(results).toEqual(keys);
    expect(normalResolver).toHaveBeenCalledTimes(1);
    expect(normalResolver).toHaveBeenCalledWith(keys, 1);
  });

  test("should work correctly with the DataLoader library", async () => {
    const { dataLoader, mockBatchLoadFunction, mockResolve } =
      constructDataLoaderWithMocks(
        groupBatchLoadFn,
        mockGetProductsByOrderIdAndStatusResolver
      );

    const keys = [
      { id: 1, status: "BOUGHT" },
      { id: 2, status: "BOUGHT" },
      { id: 2, status: "BOUGHT" },
      { id: 3, status: "SOLD" },
      { id: 100, status: "BOUGHT" },
      { id: 100, status: "INVALID" },
      { id: 2, status: "INVALID" },
    ];

    const proms = keys.map((k) => dataLoader.load(k));

    const results = await Promise.all(proms);

    // it should return all the results in the same order as the keys
    expect(results).toEqual([
      [{ id: 1, status: "BOUGHT", orderId: 1 }],
      [{ id: 4, status: "BOUGHT", orderId: 2 }],
      [{ id: 4, status: "BOUGHT", orderId: 2 }],
      [
        { id: 6, status: "SOLD", orderId: 3 },
        { id: 7, status: "SOLD", orderId: 3 },
      ],
      [],
      [],
      [],
    ]);

    // it should only be called once by DataLoader.
    expect(mockBatchLoadFunction).toHaveBeenCalledTimes(1);

    // data loader should have removed the duplicate
    expect(mockBatchLoadFunction).toHaveBeenCalledWith([
      { id: 1, status: "BOUGHT" },
      { id: 2, status: "BOUGHT" },
      { id: 3, status: "SOLD" },
      { id: 100, status: "BOUGHT" },
      { id: 100, status: "INVALID" },
      { id: 2, status: "INVALID" },
    ]);

    // it should be called as many times as there are statuses in the keys
    expect(mockResolve).toHaveBeenCalledTimes(3);

    const keysWithStatusBoughtAndDuplicatesRemoved = keys
      .filter((k) => k.status === "BOUGHT")
      .filter((_, index) => index !== 2);
    expect(mockResolve).toHaveBeenCalledWith(
      keysWithStatusBoughtAndDuplicatesRemoved,
      { status: "BOUGHT" }
    );
  });
});

const constructDataLoaderWithMocks = (groupedBatchLoadFn, resolve) => {
  const options = {
    getStaticFields: ({ status }) => ({
      status,
    }),
  };

  const cacheKeyFn = objectHash;
  const mockResolve = vi.fn().mockImplementation(resolve);

  const mockBatchLoadFunction = vi
    .fn()
    .mockImplementation(groupedBatchLoadFn(mockResolve, options));

  const dataLoader = new DataLoader(mockBatchLoadFunction, { cacheKeyFn });

  return { dataLoader, mockBatchLoadFunction, mockResolve };
};
