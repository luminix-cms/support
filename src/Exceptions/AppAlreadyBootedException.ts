
export default class AppAlreadyBootedException extends Error {

    [Symbol.toStringTag] = 'AppAlreadyBootedException';

    constructor() {
        super('[Luminix] App already booted. `create()` has been called with services already registered.');
    }

}