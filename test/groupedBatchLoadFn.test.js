// @ts-check
import { groupedBatchLoadFn } from "../src/groupedBatchLoadFn";
import { expect, test, describe, vi } from "vitest";

const products = {
  1: { id: 1, status: "BOUGHT", orderId: 1 },
  2: { id: 2, status: "SOLD", orderId: 1 },
  3: { id: 3, status: "SOLD", orderId: 1 },
  4: { id: 4, status: "BOUGHT", orderId: 2 },
  5: { id: 5, status: "SOLD", orderId: 2 },
  6: { id: 6, status: "SOLD", orderId: 3 },
  7: { id: 7, status: "SOLD", orderId: 3 },
};

const mockImplResolve = async (keys, staticFields) => {
  console.log("mockImplResolve", keys, staticFields);
  const out = Object.values(products).filter(
    (product) =>
      product.status === staticFields.status &&
      keys.map((k) => k.id).includes(product.orderId)
  );

  console.log(out);
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
    ];
    const results = await batchLoadFunction(keys);
    console.log(results);
    console.log(results);

    expect(results).toEqual([
      // TODO: make 100% sure this is correct (it isn't!!)
      [{ id: 1, status: "BOUGHT", orderId: 1 }],
      [{ id: 4, status: "BOUGHT", orderId: 1 }],
      [
        { id: 6, status: "SOLD", orderId: 3 },
        { id: 7, status: "SOLD", orderId: 3 },
      ],
    ]);

    expect(resolve).toHaveBeenCalledTimes(2);
    expect(resolve).toHaveBeenCalledWith(
      [
        { id: 1, status: "BOUGHT" },
        { id: 2, status: "BOUGHT" },
      ],
      { status: "BOUGHT" }
    );
    expect(resolve).toHaveBeenCalledWith([{ id: 3, status: "SOLD" }], {
      status: "SOLD",
    });
  });
});
