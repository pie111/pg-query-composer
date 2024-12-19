class QueryCrafter {
	filters: { [key: string]: string };
	fields: Array<string>;
	table: string;
	conditions: string = '';
	sortConditions: string = '';
	offsetCondition: string = '';
	limitCondition: string = '';
	joinQuery: string = '';

	constructor(filters: { [key: string]: string }, fields: Array<string>, table: string) {
		this.filters = filters;
		this.fields = fields;
		this.table = table;
		this.filters = this.sanitizeFiltersObject(filters);
		this.fields = this.sanitizeFields(fields);
    	this.table = this.sanitizeTable(table);
	}

	private craftConditions() {
		let keyCount = 0;
		const totalKeyCount = Object.keys(this.filters).length;
		for (const key in this.filters) {
			keyCount++;
			const value = this.filters[key];
			this.sanitizeFilters(value);
			if (value !== '') {
				this.conditions += ` ${key}='${value}'`;
				if(keyCount < totalKeyCount) this.conditions += ' AND ';
			}
		}
		this.conditions = this.conditions.trim();
	}

	private sanitizeFilters(value: string): string {
		if (typeof value === 'string') {
			// Remove dangerous SQL keywords (basic sanitization)
			if (/(\b(SELECT|DROP|DELETE|INSERT|UPDATE|UNION|--)\b)/i.test(value)) {
				throw new Error(`Invalid value: ${value}`);
			}
			// Remove any single quotes to prevent SQL injection
			value = value.replace(/'/g, "''");
			// Remove any semicolons to prevent SQL injection
			value = value.replace(/;/g, '');
		}
		return value;
	}

	private sanitizeFiltersObject(filters: { [key: string]: string }): { [key: string]: string } {
		const sanitizedFilters: { [key: string]: string } = {};
		for (const key in filters) {
			sanitizedFilters[key] = this.sanitizeFilters(filters[key]);
		}
		return sanitizedFilters;
	}

	private sanitizeFields(fields: Array<string>): Array<string> {
		return fields.map((field) => {
			if (/\W/.test(field) || /(\b(SELECT|DROP|DELETE|INSERT|UPDATE|UNION|--)\b)/i.test(field)) {
				throw new Error(`Invalid field name: ${field}`);
			}
			return field;
		});
	}


	private sanitizeTable(table: string): string {
		if (/\W/.test(table) || /(\b(SELECT|DROP|DELETE|INSERT|UPDATE|UNION|--)\b)/i.test(table)) {
			throw new Error(`Invalid table name: ${table}`);
		}
		return table;
	}

	addOffset(offset: number) {
		this.offsetCondition += ` OFFSET ${offset}`;
	}

	addLimit(limit: number) {
		this.limitCondition += ` LIMIT ${limit}`;
	}

	sortResults(sortBy: string, sortOrder: string) {
		this.sortConditions += ` ORDER BY ${sortBy} ${sortOrder}`;
	}

	/**
   * @param tableTobeJoined: string
   * @param joinCondition: { [key: string]: string } eg :-  {table1 : field1,table2:field2} then the join would be table1.field1 = table2.field2
   */
	joinConditions(tableTobeJoined: string, joinCondition: { [key: string]: string }) {
		this.joinQuery += ` JOIN ${tableTobeJoined} `;
		let joinConditionQuery = '';
		const totalKeyCount = Object.keys(joinCondition).length;
		if(totalKeyCount < 2) {
			throw new Error('Join condition should have atleast two tables');
		}
		let keyCount = 0;
		for (const key in joinCondition) {
			keyCount ++;
			joinConditionQuery += `${key}.${joinCondition[key]}`;
			if(keyCount < totalKeyCount) joinConditionQuery += ' = ';
		}
		joinConditionQuery = joinConditionQuery.replace(/=+$/, '');
		this.joinQuery += `ON ${joinConditionQuery}`;
	}

	buildFinalQuery() {
		this.craftConditions();
		let query = `SELECT ${this.fields.join(', ')} FROM ${this.table}`;
		if(this.joinQuery) query += this.joinQuery;
		query += ` WHERE ${this.conditions.trim()}`;
		if(this.sortConditions) query += this.sortConditions;
		if(this.offsetCondition) query += this.offsetCondition;
		if(this.limitCondition) query += this.limitCondition;
		return query+';';
	}

}

export default QueryCrafter;

