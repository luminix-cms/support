# Getting started

```bash
npm install @luminix/support
```

Every export is a plain class or a ready-made singleton — nothing is generated, nothing is
configured at build time. `axios` and `immer` are re-exported from the entry point, so code that
needs either does not import a second copy:

```typescript
import { Application, Collection, Client, Str, axios, immer } from '@luminix/support';
```

## When to reach for this package by name

An app running `@luminix/core` is already using these primitives: a query returns a `Collection`,
`config()` reads a `PropertyBag`, `App` is a facade over this `Application`, and the reducer names
on `Model` and `Route` are this package's `Reducible`. Import from `@luminix/support` when you are

- writing a `ServiceProvider`, or a facade of your own over a service you registered
- holding a `Collection` that a relation, a paginated response or `collect()` handed you
- making an HTTP call outside the named-route table — a third-party API, an unrouted endpoint
- teaching `Str`, `Obj` or another singleton a method with `.macro()`

## `create()` reads the DOM

`Application.create()` calls `loadConfiguration()`, which dereferences `document` before anything
else. In Node with no DOM global that throws a `ReferenceError`, so a test runner needs `jsdom`
(or a `document` stub) even when the code under test never touches the page.

## A container, end to end

```typescript
import { Application, ServiceProvider, Client, Collection } from '@luminix/support';

type Services = { api: Client };

class ApiProvider extends ServiceProvider {
    register() {
        this.app.singleton('api', () => new Client()
            .baseUrl(this.app.configuration.api.url)
            .acceptJson());
    }
}

const app = new Application<Services>([ApiProvider]);
app.withConfiguration({ api: { url: 'https://example.test/api' } });
app.create();

const response = await app.make('api').get('/posts', { page: 1 });
const posts = new Collection(response.json('data'));

posts.where('status', 'published').pluck('title').each((title) => console.log(title));
```

`app.make('api')` is typed as `Client` from the `Services` generic. The `Collection` is built by
hand here because nothing below `@luminix/core` knows the shape of an API payload.
