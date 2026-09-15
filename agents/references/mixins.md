# Mixins — Macroable, Reducible, MakeFacade

Three class decorators, each returning a Proxy-backed subclass. They are how a Luminix service
stays open to extension without a fork: the utility singletons here are `Macroable`, the facades
in `@luminix/core` are `MakeFacade` over `Reducible` services.

## Macroable — methods added at runtime

```typescript
import { Macroable, Str } from '@luminix/support';

Str.macro('shout', (value: string) => `${Str.upper(value)}!`);
Str.shout('hello');          // 'HELLO!'
Str.hasMacro('shout');       // true
Str.flushMacros();           // drops every macro on that instance

class ReportStatic { /* ... */ }
type ReportMacros = { total: (rows: Row[]) => number };
const Report = new (Macroable<ReportMacros, typeof ReportStatic>(ReportStatic))();
```

`macro(name, fn)` throws `TypeError` when the second argument is not a function, and there is no
per-macro removal — `flushMacros()` is all or nothing. Macros live on the **instance**, so a macro
registered on `Str` is visible to every importer of the singleton.

The macro is bound to the underlying instance rather than to the proxy: inside a macro `this`
reaches the class's own methods but **not** other macros. Call the singleton by name
(`Str.other(...)`), as above, when one macro needs another.

## Reducible — a named, priority-ordered pipeline

```typescript
import { Reducible } from '@luminix/support';

type RouterReducers = { headers: (value: Record<string, string>, url: string) => Record<string, string> };

const Router = Reducible<RouterReducers, typeof RouterStatic>(RouterStatic);
const router = new Router();

const stop = router.reducer('headers', (draft, url) => {
    draft.Authorization = `Bearer ${tokenFor(url)}`;
    return draft;
}, 20);

const headers = router.headers({ Accept: 'application/json' }, '/posts');
stop();                              // the return value of reducer() unsubscribes
```

Calling `router.headers(value, ...args)` runs every registered callback in ascending priority
order, each receiving the previous return value. The default priority is `10`; **higher runs later
and so wins**.

When the value is draftable — a plain object or array — the chain runs inside immer, so a callback
may mutate the draft it receives *or* return a replacement, never both. Scalars are passed
straight through.

- a name that collides with a real property throws `ReducerOverrideException` at registration
- calling a name nobody registered returns the value unchanged; `hasReducer(name)` is the only
  honest feature test, since the Proxy makes `typeof instance.anything === 'function'` true
- `removeReducer(name, callback)` throws `TypeError` on a name that never had a reducer —
  unsubscribe with the function `reducer()` returned
- `getReducer(name)` returns a `Collection<{ callback, priority }>`, `clearReducer(name)` empties
  one name, `flushReducers()` empties them all

## MakeFacade — a static proxy to a container binding

```typescript
import { MakeFacade } from '@luminix/support';

class ReportFacade {
    getFacadeAccessor() { return 'report'; }   // a container key, or an object to use directly
}

export default MakeFacade<ReportService, ReportFacade>(ReportFacade, app);
// Report.generate() -> app.make('report').generate()
```

`getFacadeAccessor()` is an **instance** method — the proxy reads it off the instance, and a
static one leaves the facade throwing on first use.

The accessor is resolved on **every property access**, not once: bound with `singleton` the facade
always reaches the same instance, bound with `bind` it builds a new one per access — including
between the two halves of `Facade.a().b()`.

Methods run with `this` bound to the service, so writes inside them land on the service; a method
that returns the service returns the facade instead, keeping facade-only members reachable through
a fluent chain. Properties defined on the facade class itself win over the service's, and function
values stored as own properties (registered callbacks) come back by identity rather than wrapped.

Pass the `Application` as the second argument whenever the accessor is a string; it is only
optional because an accessor may return the service object itself.
