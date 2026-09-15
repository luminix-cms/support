# `@luminix/support`

Foundation layer of the Luminix JS stack, framework-agnostic and dependency-free at the API level:
a service container with a two-phase bootstrap, a typed event source every reactive class extends,
a Laravel-shaped `Collection`, an immutable `PropertyBag`, a fluent HTTP client over axios, three
mixins that make a class extensible at runtime, and six extensible utility singletons.

## Where to read

| Read this | When |
|---|---|
| `references/getting-started.md` | installing, what the entry point exports, why `create()` needs a DOM, when to reach for this package instead of the one above it |
| `references/application.md` | container bindings, service providers, the boot sequence, configuration, flush and re-create, reading page embeds |
| `references/events.md` | `EventSource`, typed event maps, unsubscribing, why a late listener misses `ready` |
| `references/collection.md` | querying, transforming, aggregating and mutating a `Collection`, the `change` event, where it diverges from Laravel |
| `references/property-bag.md` | dot-path reads and writes, locked paths, `change` events, cloning |
| `references/http.md` | building a request with `Client`, reading a `Response`, status helpers, throwing, validation errors |
| `references/mixins.md` | `Macroable`, `Reducible`, `MakeFacade` — adding methods, reducer pipelines, static proxies to the container |
| `references/utilities.md` | `Str`, `Obj`, `Arr`, `Func`, `Query`, `DateTime` and their macros |

## Owned elsewhere

- models, query builder, `app()` / `config()` / `auth()` / `route()`, and the reducer names
  layered on these mixins → `@luminix/core`
- `<LuminixProvider>`, hooks over these collections and events, forms → `@luminix/react`
- the MUI admin panel → `@luminix/mui-cms`
- the endpoints a `Client` call reaches, and their gates → `luminix/backend`
- the Blade directive that writes the embeds `reader()` parses → `luminix/frontend`
