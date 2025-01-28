
import Macroable from './Mixins/Macroable';
import Str from './Str';
export declare class DateTimeMacros {
    [x: string]: (...args: any[]) => any;
}

class DateTimeStatic {

    parse(value: Date | string) {
        return value instanceof Date
            ? value
            : new Date(value);
    
    }

    toDateTimeLocal(value: Date | string) {
        const date = this.parse(value);
    
        const year = `${date.getFullYear()}`;
        const month = `${Str.padLeft(`${date.getMonth() + 1}`, 2, '0')}`;
        const day = `${Str.padLeft(`${date.getDate()}`, 2, '0')}`;
        
        const hour = `${Str.padLeft(`${date.getHours()}`, 2, '0')}`;
        const minute = `${Str.padLeft(`${date.getMinutes()}`, 2, '0')}`;
    
        return `${year}-${month}-${day}T${hour}:${minute}`;
    }

}

const DateTime = new (Macroable<DateTimeMacros, typeof DateTimeStatic>(DateTimeStatic))();

export default DateTime;
