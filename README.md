
# PG QUERY CRAFTER
pg_query_crafter is a TypeScript library designed to help craft SQL queries from REST API inputs. This project is intended to simplify the process of building complex SQL queries using a straightforward and flexible interface.

Features
1. Dynamic SQL query generation
2. Support for filtering, sorting, pagination (offset/limit), and joining tables
3. Basic SQL injection prevention through input sanitization

## Installation
To install the dependencies for this project, use the following command:
```
npm install
```

### Usage
Below is an example of how you can use the QueryCrafter class to build a SQL query.

### TypeScript
```
import QueryCrafter from './src/main';

const filters = { name: 'John', age: '30' };
const fields = ['name', 'age', 'address'];
const table = 'users';

const queryCrafter = new QueryCrafter(filters, fields, table);
queryCrafter.addOffset(10);
queryCrafter.addLimit(5);
queryCrafter.sortResults('name', 'ASC');
queryCrafter.joinConditions('orders', { 'users.id': 'orders.user_id' });

const sqlQuery = queryCrafter.buildFinalQuery();
console.log(sqlQuery);
```

### Local Dev Testing
Run the example file to check the output:
```
tsx .\examples\example_01.ts
```
### Running Test Cases
To run the test cases, use the following command:
```
npx jest
```

### Scripts
test: Placeholder for test command
lint: Run ESLint with automatic fixing
Development
To lint the code, run:
```
npm run lint
```
### License
This project is licensed under the MIT License - see the LICENSE file for details.


### Contributing
Contributions are welcome! Please submit a pull request or open an issue to discuss what you would like to change.

### Issues
For any issues, please use the GitHub [Issues](https://github.com/pie111/pg_query_crafter/issues) page.
