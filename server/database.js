const sqlite = require("sqlite3");

const connectToDB = ()=> new sqlite.Database("db/EPMS.sqlite3");
module.exports.connectToDB = connectToDB;
