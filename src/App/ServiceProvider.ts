import { ApplicationInterface } from "./Interfaces";

export default class ServiceProvider {
    constructor(protected app: ApplicationInterface) {};

    boot?(): void;
    register?(): void;
    flush?(): void;
};

