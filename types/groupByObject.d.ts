export function groupByObject<TValue>(array: readonly TValue[], getProperty: (v: TValue) => Partial<TValue>): Record<string, readonly {
    indexInSourceArray: number;
    value: TValue;
}[]>;
