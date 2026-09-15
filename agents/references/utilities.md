# Utility singletons

Six shared instances — `Str`, `Obj`, `Arr`, `Func`, `Query`, `DateTime` — each `Macroable`, so any
of them takes new methods with `.macro()` (see `mixins.md`). They are singletons: a macro
registered anywhere is visible everywhere.

## `Str`

```typescript
Str.camel('hello_world');    // 'helloWorld'    — also snake, kebab, studly
Str.title('hello world');    // 'Hello World'
Str.human('hello_world');    // 'Hello world'   — sentence case, not title case
Str.ucfirst('abc');          // also lcfirst, upper, lower, trim(value, chars)
Str.padLeft('7', 3, '0');    // '007'           — also padRight, padBoth
Str.before('a/b/c', '/');    // 'a'             — also after, beforeLast, afterLast
```

The four `before`/`after` methods return an **empty string** when the needle is absent, where
Laravel returns the subject unchanged. Guard with `includes()` when "not found" must keep the
original.

Casing goes through lodash, so `camel`, `snake` and `kebab` split on case boundaries, spaces and
punctuation alike: `Str.snake('APIResponse')` is `api_response`.

## `Obj`

```typescript
Obj.get(user, 'profile.city', 'unknown');
Obj.has(user, 'profile.city');
Obj.set(draft, 'profile.city', 'Recife');   // mutates, returns void — also unset
Obj.merge(defaults, overrides);             // deep, returns a NEW object, leaves both untouched
Obj.pick(user, 'id', 'name');               // varargs paths — also omit
Obj.isEqual(a, b);  Obj.isEmpty(a);

Obj.toQuery({ where: { status: 'published' } });   // URLSearchParams: where[status]=published
Obj.toFormData(payload);                           // FormData, same bracket notation
Obj.fromQuery(new URLSearchParams(location.search));
Obj.fromFormData(formData);
```

`Obj.merge` is the one that differs from its lodash namesake: it clones the target first
(`structuredClone`, falling back to `cloneDeep` when the target holds something uncloneable such
as a function) and merges into the clone. `set` and `unset` do mutate.

`fromQuery` rebuilds nesting from bracketed or dotted keys, and every value comes back as a
**string** — `page=2` reads as `'2'`.

## `Arr`

```typescript
Arr.cartesian([1, 2], ['a', 'b']);   // [[1,'a'],[1,'b'],[2,'a'],[2,'b']]
Arr.shuffle(items);                  // a shuffled copy
Arr.sampleSize(items, 3);            // n random items
```

## `Func`

```typescript
const search = Func.debounce((term: string) => query(term), 300);
search.cancel();                     // also .flush() — lodash's debounced function
const onScroll = Func.throttle(handler, 100, { leading: true });
```

## `Query`

```typescript
Query.fromObject({ page: 2, where: { status: 'published' } });   // URLSearchParams
Query.toObject(new URLSearchParams(location.search));            // nested object of strings
Query.merge('?page=1&sort=id', '?page=2', extraParams);          // later parts win, key by key
```

`merge` reads a string part from the first `?` onward, and a string that has no `?` contributes
nothing — pass `'?page=2'`, or a `URLSearchParams`.

## `DateTime`

```typescript
DateTime.parse('2026-03-01T12:00:00Z');        // Date; a Date passes through unchanged
DateTime.toDateTimeLocal(post.published_at);   // '2026-03-01T09:00' for <input type="datetime-local">
```

`toDateTimeLocal` formats from the browser's local time zone and drops seconds. There is no
formatter beyond that one — reach for a date library when you need more.
