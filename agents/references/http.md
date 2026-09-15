# HTTP — Client, Request, Response

A fluent builder over axios, shaped like Laravel's `Http` facade.

```typescript
import { Client, isValidationError } from '@luminix/support';

const api = new Client()
    .baseUrl('https://example.test/api')
    .withToken(token)
    .acceptJson();

const res = await api.post('/users', { name: 'Alice' });
```

`Client` is a **mutable builder**: every builder method writes into the instance and returns it,
so a client held in a container keeps its base URL, headers and options for every later call. The
`with*` methods accumulate — two `withQueryParameters` calls merge — while the `replace*` twins
start that part over. Build a fresh `Client` for a call that must inherit nothing.

The verb methods return a `Request`, which implements `Promise<Response>` — `await`, `.then`,
`.catch` and `.finally` all work, over the options as they stand at the moment of the call.

## Failure never rejects

A 4xx or 5xx **resolves** with a `Response` whose `error()` holds the underlying `AxiosError`. The
promise rejects only when axios produced no response at all — network failure, timeout, an aborted
signal. So `try/catch` around an `await` catches transport problems, and the status is something
you test on the resolved value.

## Building the request

| Method | Effect |
|---|---|
| `baseUrl(url)` | axios `baseURL` |
| `accept(type)` / `acceptJson()` | `Accept` header |
| `asForm()` | urlencoded content type; bodies are converted with `Obj.toFormData` |
| `withToken(t)` / `withBasicAuth(u, p)` | `Authorization: Bearer` / `Basic` (`btoa`, so browser or jsdom) |
| `withHeaders(h)` / `replaceHeaders(h)` | merge into, or replace, the header map |
| `withQueryParameters(q)` / `replaceQueryParameters(q)` | `URLSearchParams`, query string or object |
| `withData(d)` / `replaceData(d)` | default body for `post`/`put`/`patch` when the call passes none |
| `withOptions(o)` / `replaceOptions(o)` | any other axios option — `timeout`, `signal`, `responseType` |

```typescript
await api.get('/users', { page: 1 });     // second argument REPLACES the accumulated params
await api.put('/users/1', data);
await api.patch('/users/1', patch);
await api.delete('/users/1');
```

There are no interceptors and no retry: cross-cutting concerns belong in the factory that builds
the client, or in a `Reducible` service around it.

## Reading the response

```typescript
res.status();                       // number
res.json();                         // parsed body
res.json('data.0.id', null);        // dot path with a default
res.has('errors');
res.body();                         // the body as a string
res.header('x-total-count');        // raw index into axios headers — they arrive lowercased
res.headers();
res.error();                        // the AxiosError, when the status was a failure
```

Status predicates: `successful()` (2xx), `redirect()` (3xx), `clientError()` (4xx),
`serverError()` (5xx), `failed()` (4xx or 5xx), plus one per code — `ok()`, `created()`,
`accepted()`, `noContent()`, `movedPermanently()`, `found()`, `badRequest()`, `unauthorized()`,
`paymentRequired()`, `forbidden()`, `notFound()`, `requestTimeout()`, `conflict()`,
`unprocessableEntity()`, `tooManyRequests()`.

`ok()` is **exactly 200**, not the 2xx family — a 201 or 204 is `successful()` but not `ok()`.

## Throwing on purpose

```typescript
res.throw();                                  // when failed()
res.throwIfClientError();                     // also throwIfServerError()
res.throwIf((r) => r.status() === 429);       // boolean or predicate; throwUnless is the inverse
res.throwIfStatus(409);                       // also throwUnlessStatus, both accept a predicate
```

Each returns the response when it does not throw, so they chain. What comes out is the stored
`AxiosError`, or `new Error(response.body())` when there is none — this package defines no
response exception class of its own, so catch on `isAxiosError` from axios, not on a Luminix type.

## Validation errors

```typescript
if (isValidationError(res)) {
    const errors = res.json('errors');   // typed Record<string, string[]>
}
```

The guard narrows the resolved response — pass it the value you awaited, never a caught error. It
is true only for a 422 that carries a string `message` and an `errors` object whose every value is
an array of strings; a 422 shaped any other way returns `false`.
