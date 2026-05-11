
import { AxiosHeaders, AxiosError, isAxiosError, toFormData } from "axios";

const axios = jest.fn();

export {
    AxiosHeaders,
    AxiosError,
    isAxiosError,
    toFormData,
};

export default axios;
