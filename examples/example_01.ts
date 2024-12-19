import QueryCrafter from "../src/main.js";

const filters = {type:"car", color:"red", year:"2019"};
const fields = ["model", "year", "color"];
const table = "cars";
const queryCrafter = new QueryCrafter(filters, fields, table, 1, 100);
queryCrafter.joinConditions("colors", {cars:"color", colors:"name"});
console.log(queryCrafter.buildFinalQuery());