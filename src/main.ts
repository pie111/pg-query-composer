class QueryCrafter {
  filters: { [key: string]: string };
  fields: Array<string>;
  table: string;
  conditions: string = '';
  offset: number;
  limit: number;

  constructor(filters: { [key: string]: string }, fields: Array<string>, table: string, offset: number = 0,limit:number) {
    this.filters = filters;
    this.fields = fields;
    this.table = table;
    this.offset = offset;
    this.limit = limit;
  }

  craftConditions() {
    for (const key in this.filters) {
      if (this.filters[key] !== '') {
        this.conditions += ` ${key}=${this.filters[key]} &`;
      }
    }
    this.conditions = this.conditions.trim().replace(/&+$/, '') + ';';
  }

  addOffset(offset: number) {
    this.conditions += ` OFFSET ${offset};`;
  }

  addLimit(limit: number) {
    this.conditions += ` LIMIT ${limit};`;
  }

  buildFinalQuery() {
    this.craftConditions();
    if(this.offset) this.addOffset(this.offset);
    if(this.limit) this.addLimit(this.limit);
    return `SELECT ${this.fields.join(', ')} FROM ${this.table} WHERE ${this.conditions.trim()}`;
  }

}

export default QueryCrafter;

