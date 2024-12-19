class QueryCrafter {
  filters: { [key: string]: string };
  fields: Array<string>;
  table: string;
  conditions: string = '';
  offset: number;
  limit: number;
  joinQuery: string = '';

  constructor(filters: { [key: string]: string }, fields: Array<string>, table: string, offset: number = 0,limit:number) {
    this.filters = filters;
    this.fields = fields;
    this.table = table;
    this.offset = offset;
    this.limit = limit;
  }

  private craftConditions() {
    for (const key in this.filters) {
      if (this.filters[key] !== '') {
        this.conditions += ` ${key}=${this.filters[key]} &`;
      }
    }
    this.conditions = this.conditions.trim().replace(/&+$/, '');
  }

  private addOffset(offset: number) {
    this.conditions += ` OFFSET ${offset}`;
  }

  private addLimit(limit: number) {
    this.conditions += ` LIMIT ${limit}`;
  }

  /**
   * @param tableTobeJoined: string
   * @param joinCondition: { [key: string]: string } eg :-  {table1 : field1,table2:field2} then the join would be table1.field1 = table2.field2
   */
  joinConditions(tableTobeJoined: string, joinCondition: { [key: string]: string }) {
    this.joinQuery += ` JOIN ${tableTobeJoined} `;
    let joinConditionQuery = '';
    const totalKeyCount = Object.keys(joinCondition).length
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
    if(this.offset) this.addOffset(this.offset);
    if(this.limit) this.addLimit(this.limit);
    let query = `SELECT ${this.fields.join(', ')} FROM ${this.table}`;
    if(this.joinQuery) query += this.joinQuery;
    query += ` WHERE ${this.conditions.trim()};`;
    return query;
  }

}

export default QueryCrafter;

