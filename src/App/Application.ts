import EventSource from "../Contracts/EventSource";
import ServiceProvider from "./ServiceProvider";

export type ServiceLoader = {
    loader: () => any,
    singleton?: boolean
};

export type ApplicationEvents = {
    init: (providers: ServiceProvider[]) => void;
    booting: () => void;
    booted: () => void;
    flushed: () => void;
    flushing: () => void;
    ready: () => void;
};


export default class Application<TContainers extends Record<string, any> = Record<string, any>> extends EventSource<ApplicationEvents>
{

    protected _configuration: Record<string, any> = {};

    protected singletons: Record<string, any> = {};

    protected loaders: Record<string, ServiceLoader> = {};

    private constructor(
        protected providers: (typeof ServiceProvider)[] = [],
    ) {
        super();
    }

    static provides<TContainers extends Record<string, any> = Record<string, any>>(providers: (typeof ServiceProvider)[] = [])
    {
        return new Application<TContainers>(providers);
    }

    get services() {
        return this.loaders;
    }

    get configuration() {
        return this._configuration;
    }

    bind<K extends keyof TContainers>(abstract: K, concrete: () => TContainers[K]): void
    {
        if (typeof abstract !== 'string') {
            throw new TypeError('Service name must be a string.');
        }
        this.loaders[abstract] = { loader: concrete };
    }

    singleton<K extends keyof TContainers>(abstract: K, concrete: () => TContainers[K]): void
    {
        if (typeof abstract !== 'string') {
            throw new TypeError('Service name must be a string.');
        }
        this.loaders[abstract] = {
            loader: concrete,
            singleton: true
        };
    }

    make<K extends keyof TContainers & string>(abstract: K): TContainers[K]
    {
        const loader = this.loaders[abstract];
        if (!loader) {
            throw new Error(`Service '${abstract}' is not bound in the container.`);
        }
        if (loader.singleton) {
            if (!this.singletons[abstract]) {
                this.singletons[abstract] = loader.loader();
            }
            return this.singletons[abstract];
        }

        return loader.loader();
    }


    withConfiguration(configuration: Record<string, any>): this
    {
        this._configuration = configuration;

        return this;
    }

    withProviders(providers: (typeof ServiceProvider)[]): this
    {
        this.providers.push(...providers);

        return this;
    }


    create()
    {
        const providers = this.providers.map((Provider) => {
            return new Provider(this);
        });

        this.emit('init', providers);

        providers.forEach((provider) => {
            if (provider.register) {
                provider.register();
            }
        });

        this.emit('booting');

        providers.forEach((provider) => {
            if (provider.boot) {
                provider.boot();
            }
        });

        this.emit('booted');

        this.once('flushing', () => {
            providers.forEach((provider) => {
                if (provider.flush) {
                    provider.flush();
                }
            });
        });

        this.emit('ready');
    }

    flush()
    {
        this.emit('flushing');

        this.singletons = {};
        this.loaders = {};
        this._configuration = {};
        this.providers = [];

        this.emit('flushed');
        
    }
}

