
import EventSource from '../src/Contracts/EventSource';

type TestEvents = {
    update: (e: { value: string; source: TestEmitter }) => void;
    reset:  (e: { source: TestEmitter }) => void;
};

class TestEmitter extends EventSource<TestEvents> {
    update(value: string) {
        this.emit('update', { value, source: this });
    }
    reset() {
        this.emit('reset', { source: this });
    }
}

describe('EventSource', () => {

    test('on() receives emitted event', () => {
        const emitter = new TestEmitter();
        const handler = jest.fn();

        emitter.on('update', handler);
        emitter.update('hello');

        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler).toHaveBeenCalledWith(
            expect.objectContaining({ value: 'hello', source: emitter })
        );
    });

    test('on() returns unsubscribe function that stops delivery', () => {
        const emitter = new TestEmitter();
        const handler = jest.fn();

        const off = emitter.on('update', handler);
        off();
        emitter.update('hello');

        expect(handler).not.toHaveBeenCalled();
    });

    test('once() fires only on the first emission', () => {
        const emitter = new TestEmitter();
        const handler = jest.fn();

        emitter.once('update', handler);
        emitter.update('first');
        emitter.update('second');

        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler).toHaveBeenCalledWith(
            expect.objectContaining({ value: 'first' })
        );
    });

    test('multiple listeners each receive the event independently', () => {
        const emitter = new TestEmitter();
        const handler1 = jest.fn();
        const handler2 = jest.fn();

        emitter.on('update', handler1);
        emitter.on('update', handler2);
        emitter.update('ping');

        expect(handler1).toHaveBeenCalledTimes(1);
        expect(handler2).toHaveBeenCalledTimes(1);
    });

    test('unsubscribing one listener does not affect others', () => {
        const emitter = new TestEmitter();
        const handler1 = jest.fn();
        const handler2 = jest.fn();

        const off = emitter.on('update', handler1);
        emitter.on('update', handler2);

        off();
        emitter.update('ping');

        expect(handler1).not.toHaveBeenCalled();
        expect(handler2).toHaveBeenCalledTimes(1);
    });

    test('flushEvents() prevents all subsequent deliveries', () => {
        const emitter = new TestEmitter();
        const handler = jest.fn();

        emitter.on('update', handler);
        emitter.flushEvents();
        emitter.update('after-flush');

        expect(handler).not.toHaveBeenCalled();
    });

    test('independent events on the same emitter do not interfere', () => {
        const emitter = new TestEmitter();
        const updateHandler = jest.fn();
        const resetHandler = jest.fn();

        emitter.on('update', updateHandler);
        emitter.on('reset', resetHandler);

        emitter.update('x');

        expect(updateHandler).toHaveBeenCalledTimes(1);
        expect(resetHandler).not.toHaveBeenCalled();
    });

    test('event carries the correct source reference', () => {
        const emitter = new TestEmitter();
        let captured: TestEmitter | null = null;

        emitter.on('update', (e) => { captured = e.source; });
        emitter.update('x');

        expect(captured).toBe(emitter);
    });

    test('same listener can be registered for multiple events', () => {
        const emitter = new TestEmitter();
        const handler = jest.fn();

        emitter.on('update', handler as any);
        emitter.on('reset', handler as any);

        emitter.update('x');
        emitter.reset();

        expect(handler).toHaveBeenCalledTimes(2);
    });

});
