// @ts-check
import { groupedBatchLoadFn } from "../src/groupedBatchLoadFn";
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

const mockImplResolve = async (keys, staticFields) => {
  console.log("mockImplResolve", keys, staticFields);
  const out = keys.map((key) =>
    Object.values(products).filter(
      (product) =>
        product.status === staticFields.status && key.id === product.orderId
    )
  );

  console.log("resolve returning", out, " for keys, ", keys, staticFields);
  return out;
};

// getProductsByOrderIdAndStatus
const resolve = vi.fn().mockImplementation(mockImplResolve);

describe("groupedBatchLoadFn", () => {
  test("should group and resolve keys correctly", async () => {
    const options = {
      getStaticFields: ({ status }) => ({
        status,
      }),
    };
    const batchLoadFunction = groupedBatchLoadFn(resolve, options);

    const keys = [
      { id: 1, status: "BOUGHT" },
      { id: 2, status: "BOUGHT" },
      { id: 3, status: "SOLD" },
      { id: "dones't exist", status: "BOUGHT" },
      { id: "dones't exist", status: "DOESNT_EXIST" },
      { id: 1, status: "BOUGHT" },
    ];
    const results = await batchLoadFunction(keys);
    console.log(results);
    console.log(results);

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

    expect(resolve).toHaveBeenCalledTimes(3);
    expect(resolve).toHaveBeenCalledWith(
      [
        { id: 1, status: "BOUGHT" },
        { id: 2, status: "BOUGHT" },
        { id: "dones't exist", status: "BOUGHT" },
        { id: 1, status: "BOUGHT" },
      ],
      { status: "BOUGHT" }
    );
    expect(resolve).toHaveBeenCalledWith([{ id: 3, status: "SOLD" }], {
      status: "SOLD",
    });
  });

  test("should work correctly with the DataLoader library", async () => {
    const options = {
      getStaticFields: ({ status }) => ({
        status,
      }),
    };

    const cacheKeyFn = objectHash;

    const batchLoadFunction = vi
      .fn()
      .mockImplementation(groupedBatchLoadFn(resolve, options));
    resolve.mockReset().mockImplementation(mockImplResolve);

    const dataLoader = new DataLoader(batchLoadFunction, { cacheKeyFn });

    const keys = [
      { id: 1, status: "BOUGHT" },
      { id: 2, status: "BOUGHT" },
      { id: 3, status: "SOLD" },
      { id: 100, status: "BOUGHT" },
      { id: 100, status: "INVALID" },
      { id: 2, status: "INVALID" },
    ];

    const proms = keys.map((k) => dataLoader.load(k));

    const results = await Promise.all(proms);

    expect(results).toEqual([
      [{ id: 1, status: "BOUGHT", orderId: 1 }],
      [{ id: 4, status: "BOUGHT", orderId: 2 }],
      [
        { id: 6, status: "SOLD", orderId: 3 },
        { id: 7, status: "SOLD", orderId: 3 },
      ],
      [],
      [],
      [],
    ]);

    expect(batchLoadFunction).toHaveBeenCalledTimes(1);
    expect(resolve).toHaveBeenCalledTimes(3);
  });
});
