// @ts-check
import { test, expect } from "vitest";
import { groupBy } from "../src/groupBy";

test("groupBy should group elements based on the iteratee function", () => {
  const collection = [1, 2, 3, 4, 5];
  const iteratee = (num) => (num % 2 === 0 ? "even" : "odd");

  const result = groupBy(collection, iteratee);

  expect(result).toEqual({
    odd: [1, 3, 5],
    even: [2, 4],
  });
});

test("groupBy should group elements when an object is passed", () => {
  const collection = [{ id: 1 }, { id: "2" }, { id: 3 }, { id: 4 }, { id: 4 }];
  const iteratee = (obj) => obj.id;

  const result = groupBy(collection, iteratee);

  expect(result).toEqual({
    1: [{ id: 1 }],
    2: [{ id: "2" }],
    3: [{ id: 3 }],
    4: [{ id: 4 }, { id: 4 }],
  });
});

test("groupBy should handle empty collection", () => {
  const collection = [];
  const iteratee = (num) => (num % 2 === 0 ? "even" : "odd");

  const result = groupBy(collection, iteratee);

  expect(result).toEqual({});
});
