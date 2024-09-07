import Response from "../Response";

export type ValidationError = {
    message: string;
    errors: {
        [key: string]: string[];
    };
};

export default function isValidationError(response: unknown): response is Response<ValidationError> {
    return response instanceof Response
        && response.unprocessableEntity()
        && typeof response.json('message') === 'string'
        && typeof response.json('errors') === 'object'
        && response.json('errors') !== null
        && Object.values(response.json('errors')).every((value) => Array.isArray(value) && value.every((v) => typeof v === 'string'));
};
