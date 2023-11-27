# Dataloader-group-batch-load-fn

## The problem

There's no built-in way to pass args to a dataloader batch function ([detail here](https://github.com/graphql/dataloader/issues/147)https://github.com/graphql/dataloader/issues/147).

In order to support queries with aliases (like below), we want to be able to run the same loader with different arguments. In this case, `getMembersByEnterpriseId` for the same enterprise but with a different filter for `role`.

```gql
query {
  enterprise(slug: "github") {
    id
    members(role: MEMBER) {
      edges {
        node {
          id
        }
      }
    }
    admins: members(role: OWNER) {
      edges {
        node {
          id
        }
      }
    }
  }
}
```

## How to use it

Wrap your batchloadfn with the `groupBatchLoadFn`:

```ts
import objectHash from "object-hash";
import { groupBatchLoadFn } from "dataloader-group-batch-load-fn";

// gets run once for every set of args with all the keys that match those args
const groupedBatchLoadFn = (keys, args) => {
  const results = await db.query
    .from("members")
    .where(
      "enterprise_id",
      "in",
      keys.map((k) => k.id)
    )
    .where("role", args.role);
  return results;
};

const batchLoadFn = groupBatchLoadFn(groupedBatchLoadFn, {
  // should take a key and return that key with only the arguments you want to group the `groupedBatchLoadFn` by.
  getArgs: (key: { id: string; role: string }) => ({ role: key.role }),
});

new DataLoader(batchLoadFn, {
  cacheKeyFn: (key) => objectHash(key),
});
```
