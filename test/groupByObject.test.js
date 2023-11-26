// @ts-check
import { expect, describe, test } from "vitest";
import { groupByObject } from "../src/groupByObject";
import objectHash from "object-hash";

describe("groupByObject", () => {
  test("should group keys by object properties", () => {
    const keys = [
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
      { id: 3, name: "John" },
    ];

    const getProperty = (v) => ({ name: v.name });

    const result = groupByObject(keys, getProperty);

    expect(result).toEqual({
      [objectHash({ name: "John" })]: [
        { id: 1, name: "John" },
        { id: 3, name: "John" },
      ],
      [objectHash({ name: "Jane" })]: [{ id: 2, name: "Jane" }],
    });
  });

  test("should handle empty keys array", () => {
    const keys = [];
    const getProperty = (v) => ({ name: v.name });

    const result = groupByObject(keys, getProperty);

    expect(result).toEqual({});
  });
});
