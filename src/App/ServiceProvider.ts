import Application from './Application';


export default class ServiceProvider {
    constructor(protected app: Application) {};

    boot?(): void;
    register?(): void;
    flush?(): void;
};

