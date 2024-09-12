
import { padLeft } from './Str';

export function parse(value: Date | string) {
    return value instanceof Date
        ? value
        : new Date(value);

}

export function toDateTimeLocal(value: Date | string) {
    const date = parse(value);

    const year = `${date.getFullYear()}`;
    const month = `${padLeft(`${date.getMonth() + 1}`, 2, '0')}`;
    const day = `${padLeft(`${date.getDate()}`, 2, '0')}`;
    const hour = `${padLeft(`${date.getHours()}`, 2, '0')}`;
    const minute = `${padLeft(`${date.getMinutes()}`, 2, '0')}`;

    return `${year}-${month}-${day}T${hour}:${minute}`;
}



