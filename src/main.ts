class QueryCrafter {
  filters: { [key: string]: string };
  fields: Array<string>;
  table: string;
  conditions: string = '';

  constructor(filters: { [key: string]: string }, fields: Array<string>, table: string) {
    this.filters = filters;
    this.fields = fields;
    this.table = table;
  }

  craftConditions() {
    for (const key in this.filters) {
      if (this.filters[key] !== '') {
        this.conditions += ` ${key}=${this.filters[key]} &`;
      }
    }
    this.conditions = this.conditions.slice(0, -1)+';';
  }

  buildFinalQuery() {
    this.craftConditions()
    return`SELECT ${this.fields.join(', ')} FROM ${this.table} WHERE ${this.conditions}`;
  }

}

export default QueryCrafter;

