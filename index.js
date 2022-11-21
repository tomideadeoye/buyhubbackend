// backend for buyhub. This backend creates a API for the use of the frontend and mobile.
// This backend is written in Node.js (Express.js), uses MongoDB as a database and graphql as a query language.
// This backend is written by: Tomide Adeoye

const http = require("http");
const app = require("./app");

const server = http.createServer(app);
const port = process.env.PORT || process.env.API_PORT;

server.listen(port, () =>
	console.log(`Example app listening on port ${port}!`)
);
// test accounts
// Mastercard
// 5123450000000008
// 05/21
// 100
// Verve Card
// 6280511000000095
// 12/26
// 123

// search bar proving all items in the inventory
// on select, compare all prices and generate payment link
