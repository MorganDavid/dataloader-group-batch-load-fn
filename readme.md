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

## How to use
Wrap your batchloadfn with the `groupBatchLoadFn`:
```ts
// gets run once for every unique staticFields
const batchLoadFn = groupBatchLoadFn((keys, staticFields) => {
  const results = await db.query.from("enterprises").where("id", "in", keys.map(k => k.id)).where("role",staticFields.role);
  return 
}, {getStaticFields: (key) => ({role:key.role})})
new DataLoader(batchLoadFn, {
  cacheKeyFn: (key) => objectHash(key),
})
```
