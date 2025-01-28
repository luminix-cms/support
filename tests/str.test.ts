
import Str from '../src/Str';

beforeEach(() => {
    jest.resetModules();
});

describe('automated string test', () => {

    const test_string_1 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit?";

    const test_string_2 = " Proin ultrices fringilla justo, non malesuada neque cursus at ";

    /* * * * */

    test('get character after', async () => {
        expect(Str.after(test_string_1, ', ')).toBe('consectetur adipiscing elit?');
    });

    test('get character after last', async () => {
        expect(Str.afterLast(test_string_1, 'a')).toBe('dipiscing elit?');
    });

    test('get character before', async () => {
        expect(Str.before(test_string_1, ',')).toBe('Lorem ipsum dolor sit amet');
    });

    /**
     * @toReview
     */
    test.skip('get character before last', async () => {
        expect(Str.beforeLast(test_string_1, 'r')).toBe('Loem ipsum dolo sit amet, consectetu');
    });

    test('camel case string', async () => {
        expect(Str.camel(test_string_1)).toBe('loremIpsumDolorSitAmetConsecteturAdipiscingElit');
    });

    test('lower case first letter of string', async () => {
        expect(Str.lcfirst(test_string_1)).toBe('lorem ipsum dolor sit amet, consectetur adipiscing elit?');
    });

    test('lower case string', async () => {
        expect(Str.lower(test_string_1)).toBe('lorem ipsum dolor sit amet, consectetur adipiscing elit?');
    });

    test('kebab case string', async () => {
        expect(Str.kebab(test_string_1)).toBe('lorem-ipsum-dolor-sit-amet-consectetur-adipiscing-elit');
    });

    test('pad both string', async () => {
        expect(Str.padBoth(test_string_1, 40)).toBe('Lorem ipsum dolor sit amet, consectetur adipiscing elit?');
    });

    test('pad left string', async () => {
        expect(Str.padLeft(test_string_1, 40)).toBe('Lorem ipsum dolor sit amet, consectetur adipiscing elit?');
    });

    test('pad right string', async () => {
        expect(Str.padRight(test_string_1, 40)).toBe('Lorem ipsum dolor sit amet, consectetur adipiscing elit?');
    });

    test('title case string', async () => {
        expect(Str.title(test_string_1)).toBe('Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit');
    });

    test('human readable string', async () => {
        expect(Str.human(test_string_1)).toBe('Lorem ipsum dolor sit amet consectetur adipiscing elit');
    });
    
    test('studly case string', async () => {
        expect(Str.studly(test_string_1)).toBe('LoremIpsumDolorSitAmetConsecteturAdipiscingElit');
    });

    test('snake case string', async () => {
        expect(Str.snake(test_string_1)).toBe('lorem_ipsum_dolor_sit_amet_consectetur_adipiscing_elit');
    });

    test('trim string', async () => {
        expect(Str.trim(test_string_2)).toBe('Proin ultrices fringilla justo, non malesuada neque cursus at');
    });

    test('upper case first letter of string', async () => {
        expect(Str.ucfirst(test_string_1)).toBe('Lorem ipsum dolor sit amet, consectetur adipiscing elit?');
    });

    test('upper case string', async () => {
        expect(Str.upper(test_string_1)).toBe('LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT?');
    });

});
