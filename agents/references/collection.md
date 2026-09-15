# Collection

A Laravel-shaped collection over a plain array: over a hundred methods under their Laravel names,
extending `EventSource` so every mutation emits `change`.

```typescript
import { Collection } from '@luminix/support';

const users = new Collection([
    { id: 1, name: 'Alice', age: 30, role: 'admin' },
    { id: 2, name: 'Bob',   age: 25, role: 'user'  },
]);
```

The constructor keeps the array you passed **by reference** — `users.push(...)` also grows the
original. `all()` and the `items` getter return fresh copies, so mutating what they hand back does
not reach the collection. It is iterable: `for (const u of users)` and `[...users]` work.

Keys are array indexes, not Laravel string keys. `get(index)` throws `TypeError` unless the
argument is a number, and the methods that key by something — `keyBy`, `groupBy`, `mapToGroups`,
`mapWithKeys`, `countBy` — return plain objects, not collections.

## Querying

```typescript
users.where('role', 'admin')            // two-arg form compares with ==
users.where('age', '>=', 25)            // operators: = != > >= < <=
users.whereIn('role', ['admin', 'mod']) // also whereNotIn, whereBetween, whereNotBetween
users.whereNull('deleted_at')           // also whereNotNull, whereInstanceOf(Model)
users.whereStrict('id', '1')            // === comparison; where() is ==

users.first((u) => u.age > 28)          // T | null — never undefined
users.firstOrFail()                     // throws Error('No matching item found') on null
users.firstWhere('role', '!=', 'user')
users.last((u) => u.age > 28)
users.sole('role', 'admin')             // null when zero or more than one match — no exception
users.value('name')                     // that key on the first item, null when empty

users.search((u) => u.id === 2)         // index, or false — test with ===
users.contains('role', 'admin')         // also containsStrict, doesntContain, some, every
```

`filter()` with no callback drops falsy items. `reject()` is the inverse of `filter()`; `except()`
and `only()` take **indexes**, not keys.

## Transforming

```typescript
users.map((u) => u.name)                // Collection<string>
users.pluck('name')                     // map over one key
users.select(['id', 'name'])            // Collection of narrowed objects
users.flatMap((u) => [u.name, u.role])
users.groupBy('role')                   // Record<string, User[]>
users.keyBy('id')                       // Record<string, User>
users.chunk(10)                         // Collection<Collection<User>>
users.partition((u) => u.age > 28)      // [Collection, Collection]
users.sortBy('age', 'desc')
users.sortBy([['role', 'asc'], ['age', 'desc']])
users.unique('role')                    // uniqueStrict for ===
```

Sorting never mutates: `sort`, `sortBy`, `sortDesc`, `reverse`, `median` and `last(callback)`
build a new array with `toSorted`/`toReversed`. Those are ES2023 and the published bundle is not
transpiled — on Node < 20 or a browser older than 2023 they throw "is not a function".

`sortBy(callback)` ranks by `callback(a) - callback(b)`; the callback's `index` argument counts
comparisons rather than positions, so sort on the item alone.

## Aggregating

```typescript
users.count()
users.sum('age')  users.avg('age')  users.min('age')  users.max('age')
users.median('age')  users.mode('age')
users.percentage((u) => u.role === 'admin')      // 50 — share out of 100
users.countBy((u) => u.role)                     // Record<string, number>
```

`countBy` takes a **callback**, not a key: called with a string it falls into the no-argument
branch, which throws `TypeError` unless every item is already a string or number. `sum` and `avg`
throw `TypeError` when a value is not a number, and `avg` on an empty collection is `NaN`.

`percentage` ignores its `precision` argument — the implementation writes `10 ^ precision`, which
is XOR rather than a power, so the result is rounded to eighths whatever you pass. Round the
number yourself when the display needs fixed decimals.

## Mutating, and the change event

```typescript
users.on('change', (e) => render(e.items));   // e.items is a copy; e.source is the collection

users.push(user);        // also prepend, put(index, value)
users.pop();             // also shift, pull(index), forget(index)
users.splice(1, 1, replacement);
users.transform((u) => ({ ...u, name: u.name.toUpperCase() }));   // in place, returns this
```

Those nine methods emit `change`; everything else returns a new collection and stays silent.

## Pipelines and conditionals

```typescript
users.tap((c) => console.log(c.count()))          // returns the collection
     .pipe((c) => c.pluck('name').toArray());      // returns the callback's value
```

`when`, `unless`, `whenEmpty`, `whenNotEmpty`, `unlessEmpty` and `unlessNotEmpty` run a callback
and **return the original collection** — the callback's return value is discarded, unlike Laravel.
To keep a conditional result, assign it inside the callback or branch around the chain:

```typescript
const visible = isAdmin ? users : users.where('role', 'user');
```

## Output

`all()` → `T[]`. `toArray()` → the same, with nested collections and objects flattened through
their own `toArray`/`toJson`. `toJson()` → a JSON string. `implode('name', ', ')` joins one key,
`implode(', ')` joins scalar items, `join(glue, final)` adds a different last separator, and
`dump()` logs through `console.log` unconditionally.
