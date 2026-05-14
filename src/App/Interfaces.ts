import EventSource from "../Contracts/EventSource";

export type ApplicationEvents = {
    init: (providers: ServiceProviderInterface[]) => void;
    booting: () => void;
    booted: () => void;
    flushed: () => void;
    flushing: () => void;
    ready: () => void;
};

export declare class ApplicationInterface<TContainers extends Record<string, any> = Record<string, any>> extends EventSource<ApplicationEvents> {
    get services(): Array<ServiceLoader & {
        name: string;
    }>;
    get configuration(): Record<string, any>;

    loadConfiguration(): void;
    bind<K extends keyof TContainers>(abstract: K, concrete: () => TContainers[K]): void;
    singleton<K extends keyof TContainers>(abstract: K, concrete: () => TContainers[K]): void;
    has(abstract: string): boolean;
    make<K extends keyof TContainers & string>(abstract: K): TContainers[K];
    withConfiguration(configuration: Record<string, any>): this;
    withProviders(providers: (typeof ServiceProviderInterface)[]): this;
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

