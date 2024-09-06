import { createNanoEvents, Unsubscribe } from 'nanoevents';

export type Event<TData = any, TSource extends EventSource = EventSource> = TData & {
    source: TSource;
};

export type EventMap = {
    [key: string]: (event: Event) => void
};



export default class EventSource<TEvents extends EventMap = EventMap>
{
    private emitter;

    constructor()
    {
        this.emitter = createNanoEvents<TEvents>();
    }

    on<E extends keyof TEvents>(event: E, callback: TEvents[E]): Unsubscribe
    {
        return this.emitter.on(event, callback);
    }

    once<E extends keyof TEvents>(event: E, callback: TEvents[E]): void
    {
        const off = this.emitter.on(event, ((e: Parameters<TEvents[E]>[0]) => {
            off();
            callback(e);
        }) as any);
    }

    emit<E extends keyof TEvents>(event: E, ...data: Parameters<TEvents[E]>): void
    {
        this.emitter.emit(event, ...data);
    }
}


