# Application — the service container

Two phases. `register()` only binds; `boot()` consumes other services, by which point every
provider has registered.

```typescript
import { Application, ServiceProvider } from '@luminix/support';

type Services = { auth: AuthService; clock: Clock };

class AuthProvider extends ServiceProvider {
    register() { this.app.singleton('auth', () => new AuthService()); }
    boot()     { this.app.make('auth').initialize(); }
    flush()    { /* teardown */ }
}

const app = new Application<Services>([AuthProvider]);
app.withConfiguration({ api: { url: 'https://example.test' } })
   .withProviders([ClockProvider]);
app.create();
```

All three provider methods are optional — the base class declares them as optional properties, so
a provider with only `register()` is complete. `this.app` is typed as `ApplicationInterface`,
which is neither generic nor complete: inside a provider `make()` resolves to `any`, and
`instance()` is absent from the interface, so a pre-built value gets bound through `bind` instead.

## Bindings

| Method | Behaviour |
|---|---|
| `bind('key', factory)` | factory runs on every `make()` |
| `singleton('key', factory)` | factory runs once, on first `make()` |
| `instance('key', value)` | value stored as-is |
| `has('key')` | is anything bound under that name |
| `make('key')` | resolve — **throws `Error`** when the name is not bound |

Names must be strings; anything else throws `TypeError` at bind time. Re-binding a name replaces
the loader, but a singleton already resolved keeps its cached instance until `flush()`.

## Configuration

`withConfiguration(object)` deep-merges into whatever is there (lodash `merge`, so nested objects
combine rather than replace) and returns the application for chaining. `app.configuration` hands
back the live object — this container has no dot-path reader and no `change` event; that is
`PropertyBag`, which `@luminix/core` layers on top.

`create()` first calls `loadConfiguration()`, which merges the `config` embed when the page
carries one — see *Page embeds* below.

## Lifecycle events

`create()` emits, in order:

| Event | Payload | Fired |
|---|---|---|
| `init` | the instantiated providers | before any `register()` |
| `booting` | — | after every `register()` |
| `booted` | — | after every `boot()` |
| `ready` | — | last, once the container is usable |

Nothing replays: a listener attached after `create()` never hears `ready`. Subscribe before
whatever drives the boot runs.

Calling `create()` on a container that already has services logs a warning and returns without
booting — a second `create()` is a silent no-op, not a rebuild.

## Flushing

`flush()` emits `flushing`, and a handler registered during `create()` runs each provider's
`flush()` on that event. It then clears singletons, bindings **and the provider list**, emits
`flushed`, and drops every listener with `flushEvents()`.

Two consequences for a test suite that tears down between cases: `create()` after `flush()` boots
an empty container unless you call `withProviders([...])` again, and every `on()` registered
against the application is gone, including the ones your own setup added.

## Inspecting

```typescript
const { configuration, services, providers, singletons } = app.dump(true);
```

`dump(true)` returns that object. `dump()` and `dump('label')` instead push it through
`app.make('log')` — a service this package never binds, so in a container that has no `log` they
throw `Error: Service 'log' is not bound in the container.`

## Page embeds

```typescript
import { reader } from '@luminix/support';

const routes = reader('routes');          // <script id="luminix-data::routes" data-json data-value="...">
const errors = reader('bag', 'error');    // <script id="luminix-error::bag" ...>
```

`reader(name, type = 'data')` — **name first**, and `type` is only `'data'` or `'error'`. It
requires an element with id `luminix-embed` anywhere on the page and throws `NoEmbedException`
when that wrapper is missing. A missing *named* element is not an error: the call returns `null`.
When the element carries both `data-json` and `data-value` the value is parsed as JSON; otherwise
the raw `data-value` string comes back.

`Application` reads the `config` embed for you, guarded by an existence check on
`#luminix-data::config` — no embed, no config, no throw. The guard is on the config element alone,
so a page that carries `#luminix-data::config` without the `#luminix-embed` wrapper makes
`create()` throw `NoEmbedException`.
