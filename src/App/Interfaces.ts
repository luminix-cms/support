import EventSource from "../Contracts/EventSource";

export type ApplicationEvents = {
    init: (providers: ServiceProviderInterface[]) => void;
    booting: () => void;
    booted: () => void;
    flushed: () => void;
    flushing: () => void;
    ready: () => void;
};

export type ApplicationInterface<TContainers extends Record<string, any> = Record<string, any>> = EventSource<ApplicationEvents> & {
    get services(): Record<string, ServiceLoader>;
    get configuration(): Record<string, any>;

    loadConfiguration(): void;
    bind<K extends keyof TContainers>(abstract: K, concrete: () => TContainers[K]): void;
    singleton<K extends keyof TContainers>(abstract: K, concrete: () => TContainers[K]): void;
    make<K extends keyof TContainers & string>(abstract: K): TContainers[K];
    withConfiguration(configuration: Record<string, any>): ApplicationInterface;
    withProviders(providers: (typeof ServiceProviderInterface)[]): ApplicationInterface;
    create(): void;
    flush(): void;
    dump(): void
    dump($return: true): Object
    dump($return: false | string): void
}

export interface ServiceLoader {
    loader: () => any,
    singleton?: boolean
};

declare class ServiceProviderInterface {

    constructor(app: ApplicationInterface);

    boot?(): void;
    register?(): void;
    flush?(): void;

};

