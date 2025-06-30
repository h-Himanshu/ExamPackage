const { pool } = require("../database");
const md5 = require("md5");

module.exports.checkUserPassword = function (username, password, cb) {
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    const query = `select * from admin where username="${username}" and password="${md5(
      password
    )}"`;
    connection.query(query, (err, result) => {
      if (err) {
        console.error("Database Error");
        throw err;
      } else {
        cb(null, true);
      }
    });
    connection.release();
  });
};
