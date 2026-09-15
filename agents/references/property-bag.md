# PropertyBag

A dot-path store over one object, immutable by construction: every write runs through immer and
replaces the internal bag with a structurally-shared copy, then emits `change`.

```typescript
import { PropertyBag } from '@luminix/support';

const config = new PropertyBag({ app: { name: 'Luminix', debug: false } });

config.get('app.name');                 // 'Luminix'
config.get('app.missing', 'fallback');  // 'fallback'
config.has('app.debug');
config.all();                           // the live bag — read-only, see below
config.isEmpty();

config.set('app.debug', true);
config.merge('app', { version: '1.0' });
config.delete('app.debug');

config.on('change', (e) => {
    // e.path, e.value, e.type ('set' | 'merge' | 'delete'), e.source
});
```

The constructor calls `Object.freeze` on the object you hand it, so the literal you passed is now
read-only for your code too and assigning to it fails silently outside strict mode — pass a fresh
object, never one you still intend to mutate. `all()` returns that same object, and immer
deep-freezes every version produced by a write, so copy before mutating anything you read out of
the bag.

## Writes

`set(path, value)` and `delete(path)` accept any lodash path, creating intermediate objects as
needed. `merge(path, value)` requires an object — anything else is a `TypeError` — and
shallow-merges it over what is there; a `null` or absent path is set outright. A non-object,
non-null value at that path throws.

Only a root merge reports `type: 'merge'`. `merge('app', ...)` delegates to `set`, so its `change`
event arrives as `type: 'set'` with the merged object as `value`.

`'.'` is the root path: `set('.', object)` replaces the entire bag (`TypeError` unless the value
is an object), and `merge('.', object)` spreads over the top level.

## Locked paths

```typescript
config.lock('auth.user');
config.set('auth.user', fake);   // Error: Cannot set a locked path "auth.user"
config.set('auth', { user });    // Error: would override a locked path
config.delete('auth.user');      // Error
```

`lock(path)` throws unless the path already exists, and the lock is permanent — there is no
unlock. Matching is `startsWith` on the raw string, not segment-aware, so locking `app.name` also
locks `app.names`.

## Cloning

`clone()` returns a new bag over the **same** object, not a deep copy. Writes stay independent
because immer never mutates in place, but locked paths are not carried over: a clone of a bag with
locked paths accepts writes the original refuses.
