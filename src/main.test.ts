import QueryCrafter from './main';

describe('QueryCrafter', () => {
    it('should initialize with given filters, fields, and table', () => {
        const filters = { name: 'John' };
        const fields = ['name', 'age'];
        const table = 'users';
        const queryCrafter = new QueryCrafter(filters, fields, table);

        expect(queryCrafter.filters).toEqual(filters);
        expect(queryCrafter.fields).toEqual(fields);
        expect(queryCrafter.table).toBe(table);
    });

    it('should craft conditions correctly', () => {
        const filters = { name: 'John', age: '30' };
        const fields = ['name', 'age'];
        const table = 'users';
        const queryCrafter = new QueryCrafter(filters, fields, table);

        queryCrafter.buildFinalQuery();
        expect(queryCrafter.conditions).toBe("name='John' AND  age='30'");
    });

    it('should add offset correctly', () => {
        const filters = { name: 'John' };
        const fields = ['name', 'age'];
        const table = 'users';
        const queryCrafter = new QueryCrafter(filters, fields, table);

        queryCrafter.addOffset(10);
        expect(queryCrafter.offsetCondition).toBe(' OFFSET 10');
    });

    it('should add limit correctly', () => {
        const filters = { name: 'John' };
        const fields = ['name', 'age'];
        const table = 'users';
        const queryCrafter = new QueryCrafter(filters, fields, table);

        queryCrafter.addLimit(5);
        expect(queryCrafter.limitCondition).toBe(' LIMIT 5');
    });

    it('should sort results correctly', () => {
        const filters = { name: 'John' };
        const fields = ['name', 'age'];
        const table = 'users';
        const queryCrafter = new QueryCrafter(filters, fields, table);

        queryCrafter.sortResults('name', 'ASC');
        expect(queryCrafter.sortConditions).toBe(' ORDER BY name ASC');
    });

    it('should join conditions correctly', () => {
        const filters = { name: 'John' };
        const fields = ['name', 'age'];
        const table = 'users';
        const queryCrafter = new QueryCrafter(filters, fields, table);

        queryCrafter.joinConditions('orders', { 'users': 'id','orders':'user_id' });
        expect(queryCrafter.joinQuery).toBe(' JOIN orders ON users.id = orders.user_id');
    });

    it('should build final query correctly', () => {
        const filters = { name: 'John', age: '30' };
        const fields = ['name', 'age'];
        const table = 'users';
        const queryCrafter = new QueryCrafter(filters, fields, table);

        queryCrafter.addOffset(10);
        queryCrafter.addLimit(5);
        queryCrafter.sortResults('name', 'ASC');
        queryCrafter.joinConditions('orders', { 'users': 'id', 'orders': 'user_id' });

        const expectedQuery = "SELECT name, age FROM users JOIN orders ON users.id = orders.user_id WHERE name='John' AND  age='30' ORDER BY name ASC OFFSET 10 LIMIT 5;";
        expect(queryCrafter.buildFinalQuery()).toBe(expectedQuery);
    });

    it('should throw error for invalid filter value', () => {
        const filters = { name: 'John', age: '30', query: 'DROP TABLE users' };
        const fields = ['name', 'age'];
        const table = 'users';
        expect(() => new QueryCrafter(filters, fields, table)).toThrow('Invalid value: DROP TABLE users');
    });

    it('should throw error for invalid join condition', () => {
        const filters = { name: 'John' };
        const fields = ['name', 'age'];
        const table = 'users';
        const joinCondition = { 'users': 'id' };
        const queryCrafter = new QueryCrafter(filters, fields, table);

        expect(() => queryCrafter.joinConditions('orders', joinCondition)).toThrow('Join condition should have atleast two tables');
    });
});

describe('sanitizeFields', () => {
    let queryCrafter: any;

    beforeEach(() => {
        queryCrafter = new QueryCrafter({}, [], ''); // Initialize with dummy values
    });

    it('should return the same fields if they are valid', () => {
        const fields = ['name', 'age', 'user_id'];
        const sanitizedFields = (queryCrafter as any).sanitizeFields(fields);
        expect(sanitizedFields).toEqual(fields);
    });

    it('should throw an error for fields with special characters', () => {
        const fields = ['name', 'age$', 'user_id'];
        expect(() => (queryCrafter as any).sanitizeFields(fields)).toThrow('Invalid field name: age$');
    });

    it('should throw an error for fields with spaces', () => {
        const fields = ['name', 'user id', 'age'];
        expect(() => (queryCrafter as any).sanitizeFields(fields)).toThrow('Invalid field name: user id');
    });

    it('should throw an error for fields with SQL keywords', () => {
        const fields = ['name', 'SELECT', 'age'];
        expect(() => (queryCrafter as any).sanitizeFields(fields)).toThrow('Invalid field name: SELECT');
    });

    it('should return an empty array if no fields are provided', () => {
        const fields: string[] = [];
        const sanitizedFields = (queryCrafter as any).sanitizeFields(fields);
        expect(sanitizedFields).toEqual([]);
    });
});



describe('sanitizeTable', () => {
    let queryCrafter: any;

    beforeEach(() => {
        queryCrafter = new QueryCrafter({}, [], ''); // Initialize with dummy values
    });

    it('should return the same table name if it is valid', () => {
        const table = 'users';
        const sanitizedTable = (queryCrafter as any).sanitizeTable(table);
        expect(sanitizedTable).toBe(table);
    });

    it('should throw an error for table name with special characters', () => {
        const table = 'users$';
        expect(() => (queryCrafter as any).sanitizeTable(table)).toThrow('Invalid table name: users$');
    });

    it('should throw an error for table name with spaces', () => {
        const table = 'user table';
        expect(() => (queryCrafter as any).sanitizeTable(table)).toThrow('Invalid table name: user table');
    });

    it('should throw an error for table name with SQL keywords', () => {
        const table = 'SELECT';
        expect(() => (queryCrafter as any).sanitizeTable(table)).toThrow('Invalid table name: SELECT');
    });

    it('should throw an error for table name with & start', () => {
        const table = '&*users';
        expect(() => (queryCrafter as any).sanitizeTable(table)).toThrow('Invalid table name: &*users');
    });
});