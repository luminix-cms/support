import EventSource from '../Contracts/EventSource';
import reader from '../reader';

import { ApplicationEvents, ServiceLoader } from './Interfaces';
import ServiceProvider from './ServiceProvider';

import { merge } from 'lodash-es';

export type ApplicationDump = {
    configuration: Record<string, any>;
    services: ServiceLoader[];
    providers: (typeof ServiceProvider)[];
    singletons: Record<string, any>;
}

export default class Application<TContainers extends Record<string, any> = Record<string, any>>
    extends EventSource<ApplicationEvents>
{

    protected _configuration: Record<string, any> = {};

    protected singletons: Record<string, any> = {};

    protected loaders: Record<string, ServiceLoader> = {};

    constructor(
        protected providers: (typeof ServiceProvider)[] = [],
    ) {
        super();
    }

    get services() {
        return Object.entries(this.loaders).map(([name, loader]) => {
            return {
                name,
                ...loader,
            };
        });
    }

    get configuration() {
        return this._configuration;
    }

    loadConfiguration() {
        if (document.getElementById('luminix-data::config')) {
            const data = reader('config');
            if (data && typeof data === 'object') {
                this.withConfiguration(data);
            }
        }
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
        merge(this._configuration, configuration);

        return this;
    }

    withProviders(providers: (typeof ServiceProvider)[]): this
    {
        this.providers.push(...providers);

        return this;
    }


    create()
    {
        if (this.services.length > 0) {
            console.warn('[Luminix] Application already created. Skipping double invocation of `create()`. '
                + 'If you want to re-create the application, please flush it first.'
            );
            return;
        }

        this.loadConfiguration();

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

        this.flushEvents();
        
    }

    dump(): void
    dump($return: true): ApplicationDump
    dump($return: false | string): void
    dump($return: string | boolean = false): void | ApplicationDump
    {
        const data = {
            configuration: this.configuration,
            services: this.services,
            providers: this.providers,
            singletons: this.singletons,
        };

        if ($return === true) {
            return data;
        }

        const logger = this.make('log');

        if ($return === false) {
            logger.info(data);
        }

        logger.info($return, data);
    }
}




