
import DateTime from '../src/DateTime';

beforeEach(() => {
    jest.resetModules();
});

describe('automated datetime test', () => {

    const datetime = "2025-01-28 11:15:00";

    test('parse a date', async () => {
        const parsed = DateTime.parse(datetime);

        expect(parsed).toEqual(new Date(datetime));
    });

    test('convert a date to datetime local', async () => {
        const toLocal = DateTime.toDateTimeLocal(datetime);

        expect(toLocal).toEqual("2025-01-28T11:15");
    });

});
