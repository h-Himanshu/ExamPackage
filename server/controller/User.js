const { connectToDB } = require("../database");
// const { pool } = require("../database");
const md5 = require("md5");

module.exports.getById = function (id, cb) {
  const db = connectToDB();
  const query = `select * from admin where id=?`;
  const teacherQuery = `SELECT * FROM person where id = ?`
  db.get(query, id, (err, row) => {
    console.log("Getting User");
    if (err) {
      console.error("Database Error");
      cb(err, null);
      return
    }
    if( row ) {
      cb( null, row );
      return
    }
    
    db.get(teacherQuery, id, ( err, row)=>{
      if (err) {
        console.error("Database Error");
        cb(err, null);
        return
      }
      if( row ) {
        cb( null, row );
        return
      }
    })
    db.close( err =>{
      console.log("Closing Database")
      if( err ){
        console.log( "Database closing error", err );
      }

    })
  
  })
  // pool.getConnection(function (err, connection) {
  //   if (err) cb(err);
  //   console.log("Database connected for dbaccess");

  //   connection.query(query, (err, result) => {
  //     if (err) {
  //       console.error("Database Error");
  //       cb(err);
  //     } else {
  //       cb(null, result[0]);
  //     }
  //   });
  //   connection.release();
  // });
};

module.exports.getByUsernamePassword = function (username, password, cb) {
  const query = `select * from admin where username=? and password=?`;
  const teacherQuery = `SELECT * FROM person where email = ? AND password = ?`
  const db = connectToDB();

  db.get(query, username, md5(password), (err, row) => {
    console.log("Getting User");
    if (err) {
      console.error("Database Error");
      cb(err, null);
      return
    }
    if( row ) {
      cb( null, row );
      return
    }
    
    db.get(teacherQuery,[ username, password], ( err, row)=>{
      if (err) {
        console.error("Database Error");
        cb(err, null);
        return
      }
      if( row ) {
        cb( null, row );
        return
      }
    })
    
  });


  db.close((err) => {
    console.log("Closing database Connection");
    if (err) console.error(err);
  });
  // pool.getConnection(function (err, connection) {
  //   if (err) cb(err);
  //   console.log("Database connected for dbaccess");

  //   connection.query(query, (err, result) => {
  //     if (err) {
  //       console.error("Database Error");
  //       cb(err);
  //     } else {
  //       cb(null, result[0]);
  //     }
  //   });
  //   connection.release();
  // });
};
