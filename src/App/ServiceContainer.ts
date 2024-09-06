




export default class ServiceContainer<TServices extends Map<string, any> = Map<string, any>> {

    private services: TServices = new Map() as TServices;

    bind<K extends keyof TServices>(abstract: K, concrete: () => TServices[K]): void {
        if (typeof abstract !== 'string') {
            throw new TypeError('Service name must be a string.');
        }
        this.services.set(abstract, concrete);
    }

    singleton<K extends keyof TServices>(abstract: K, concrete: TServices[K]): void {
        if (typeof abstract !== 'string') {
            throw new TypeError('Service name must be a string.');
        }
        this.services.set(abstract, concrete);
    }

    get(serviceName: string): any {
        const service = this.services.get(serviceName);
        if (!service) {
            throw new Error(`Service '${serviceName}' is not bound in the container.`);
        }
        return service;
    }
}

