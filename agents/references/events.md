# EventSource — typed events

`Application`, `Collection` and `PropertyBag` all extend `EventSource`, and so can your own
classes. The generic is a map of event name to callback signature; `emit` is then checked against
it.

```typescript
import { EventSource, type Event } from '@luminix/support';

type CartEvents = {
    added: (e: Event<{ item: Item }, Cart>) => void;
    cleared: (e: Event<object, Cart>) => void;
};

class Cart extends EventSource<CartEvents> {
    add(item: Item) {
        this.emit('added', { item, source: this });
    }
}

const cart = new Cart();
const off = cart.on('added', (e) => console.log(e.item, e.source));
cart.once('cleared', () => reset());

off();                 // unsubscribe this listener
cart.flushEvents();    // drop every listener on the instance
```

`Event<TData, TSource>` is `TData & { source: TSource }` — a type, not behaviour. **`emit` adds
nothing to the payload**: an emitter that wants `e.source` passes `source: this` by hand, which is
what every class in this package does.

## What the API gives you, and what it does not

- `on(event, callback)` returns the unsubscribe function — the only way to drop one listener, and
  the value a React effect returns as its cleanup
- `once(event, callback)` unsubscribes before invoking, so emitting the same event from inside the
  handler does not re-enter it. It returns nothing; to cancel one, use `on` and unsubscribe
  yourself
- `emit(event, ...payload)` is synchronous; a throwing listener propagates out of the `emit` call
  and the listeners after it never run
- `flushEvents()` empties the whole registry at once — there is no per-event clear, no wildcard
  listener and no listener count
- nothing replays: a listener attached after an event fired never sees it

## Typing against someone else's emitter

```typescript
import type { EventMapOf, EventsOf, EventCallbackOf } from '@luminix/support';

function relay<S extends EventSource, E extends EventsOf<S>>(
    source: S, event: E, callback: EventCallbackOf<S, E>
) {
    return source.on(event, callback);
}
```

`EventMapOf<S>` recovers the event map from an `EventSource` subclass, `EventsOf<S>` its event
names, `EventCallbackOf<S, E>` one callback signature. Use them when you accept an emitter as an
argument rather than naming its concrete event map.
