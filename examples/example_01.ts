import QueryCrafter from "../src/main.js";

const filters = {type:"car", color:"red", year:"2019"};
const fields = ["model", "year", "color"];
const table = "cars";
const queryCrafter = new QueryCrafter(filters, fields, table);
// queryCrafter.joinConditions("colors", {cars:"color", colors:"name"});
queryCrafter.addLimit(10);
queryCrafter.addOffset(5);
queryCrafter.sortResults("color", "DESC");
console.log(queryCrafter.buildFinalQuery());