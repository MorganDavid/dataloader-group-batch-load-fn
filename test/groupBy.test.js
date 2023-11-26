// @ts-check
import { test, expect } from "vitest";
import { groupBy } from "../src/groupBy";

test("groupBy should group elements based on the iteratee function", () => {
  const collection = [1, 2, 3, 4, 5];
  const iteratee = (num) => (num % 2 === 0 ? "even" : "odd");

  const result = groupBy(collection, iteratee);

  expect(result).toEqual({
    odd: [
      { indexInSourceArray: 0, value: 1 },
      { indexInSourceArray: 2, value: 3 },
      { indexInSourceArray: 4, value: 5 },
    ],
    even: [
      { indexInSourceArray: 1, value: 2 },
      { indexInSourceArray: 3, value: 4 },
    ],
  });
});

test("groupBy should group elements when an object is passed", () => {
  const collection = [{ id: 1 }, { id: "2" }, { id: 3 }, { id: 4 }, { id: 4 }];
  const iteratee = (obj) => obj.id;

  const result = groupBy(collection, iteratee);

  expect(result).toEqual({
    1: [{ value: { id: 1 }, indexInSourceArray: 0 }],
    2: [{ value: { id: "2" }, indexInSourceArray: 1 }],
    3: [{ value: { id: 3 }, indexInSourceArray: 2 }],
    4: [
      { value: { id: 4 }, indexInSourceArray: 3 },
      { value: { id: 4 }, indexInSourceArray: 4 },
    ],
  });
});

test("groupBy should handle empty collection", () => {
  const collection = [];
  const iteratee = (num) => (num % 2 === 0 ? "even" : "odd");

  const result = groupBy(collection, iteratee);

  expect(result).toEqual({});
});
