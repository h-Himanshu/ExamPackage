const express = require("express");
const { connectToDB } = require("../database");
const { check, validationResult } = require("express-validator");

const router = express.Router();

router.delete("/package/:id", (req, res) => {
  const deletePackageQuery = `DELETE FROM package WHERE id=?`;

  const db = connectToDB();
  db.run(deletePackageQuery, [req.params.id], function (err) {
    if (err) {
      res.status(400).send(req.body);
      console.log(err)
      return console.error(err.message);
    }
    console.log(`Package(s) deleted with id = ${req.params.id}`);
    res.status(200).send(req.body);
  });
  db.close((err) => {
    console.log("Closing database connection.");
    if (err) {
      console.error(err.message);
    }
  });
});

router.delete("/exam/:id", (req, res) => {
  const deleteQuery = `
        DELETE FROM exam WHERE id=${req.params.id}
        `;

  const db = connectToDB();
  db.run(deleteQuery, [], function (err) {
    if (err) {
      res.status(400).send(req.body);
      return console.error(err.message);
    }
    console.log(`Exam(s) deleted with id = ${req.params.id}`);
    res.status(200).send(req.body);
  });
  db.close((err) => {
    console.log("Closing database connection.");
    if (err) {
      console.error(err.message);
    }
  });
});

router.delete("/department/:id", (req, res) => {
  const deleteQuery = `
        DELETE FROM department WHERE id= ${req.params.id} 
        `;

  const db = connectToDB();
  db.run(deleteQuery, [], function (err) {
    if (err) {
      res.status(400).send(req.body);
      return console.error(err.message);
    }
    console.log(`Department(s) deleted with id = ${req.params.id}`);
    res.status(200).send(req.body);
  });
  db.close((err) => {
    console.log("Closing database connection.");
    if (err) {
      console.error(err.message);
    }
  });
});

router.delete("/subject/:id", (req, res) => {
  const deleteQuery = `
        DELETE FROM subject WHERE id = ${req.params.id}
        `;

  const db = connectToDB();
  db.run(deleteQuery, [], function (err) {
    if (err) {
      res.status(400).send(req.body);
      return console.error(err.message);
    }
    console.log(`Subject(s) deleted with id = ${req.params.id}`);
    res.status(200).send(req.body);
  });
  db.close((err) => {
    console.log("Closing database connection.");
    if (err) {
      console.error(err.message);
    }
  });
});

router.delete("/program/:id", (req, res) => {
  console.log("delete for program id: "+`${req.params.id}`);
  const deleteQuery = `
        DELETE FROM program WHERE id = ?
        `;
  const db = connectToDB();
  db.run(deleteQuery, [req.params.id], function (err) {
    if (err) {
      res.status(400).send(req.body);
      return console.error(err.message);
    }
    console.log(`Program(s) deleted with id = ${req.params.id}`);
    res.status(200).send(req.body);
  });
  db.close((err) => {
    console.log("Closing database connection.");
    if (err) {
      console.error(err.message);
    }
  });
});

router.delete("/person/:id", (req, res) => {
  const deleteQuery = `
        DELETE FROM person WHERE id = ${req.params.id} 
        `;
  const db = connectToDB();
  db.run(deleteQuery, [], function (err) {
    if (err) {
      res.status(400).send(req.body);
      return console.error(err.message);
    }
    console.log(`Person(s) deleted with id = ${req.params.id}`);
    res.status(200).send(req.body);
  });
  db.close((err) => {
    console.log("Closing database connection.");
    if (err) {
      console.error(err.message);
    }
  });
});

// pool.getConnection((err, connection) => {
//   if (err) throw err;
//   console.log("Database Connected");

//   router.delete("/package/:id", (req, res) => {
//     const deletePackageQuery = `
//     DELETE FROM package WHERE id="${req.params.id}"
//     `;
//     connection.query(deletePackageQuery, (err, result) => {
//       if (err){
//         res.status(400).send(req.body)
//       }
//       else {
//         console.log("Deleted package");
//         res.status(200).send(req.body);
//       }
//     });
//   });

//   router.delete("/exam/:id", (req, res) => {
//     const deleteQuery = `
//     DELETE FROM exam WHERE id="${req.params.id}"
//     `;
//     connection.query(deleteQuery, (err, result) => {
//       if (err){
//         res.status(400).send(req.body)
//       }
//       else {
//         console.log("Deleted exam");
//         res.status(200).send(req.body);
//       }
//     });
//   });

//   router.delete("/department/:id", (req, res) => {
//     const deleteQuery = `
//     DELETE FROM department WHERE id="${req.params.id}"
//     `;
//     connection.query(deleteQuery, (err, result) => {
//       if (err){
//         res.status(400).send(req.body)
//       }
//       else {
//         console.log("Deleted department");
//         res.status(200).send(req.body);
//       }
//     });
//   });

//   router.delete("/subject/:id", (req, res) => {
//     const deleteQuery = `
//     DELETE FROM subject WHERE id="${req.params.id}"
//     `;
//     connection.query(deleteQuery, (err, result) => {
//       if (err){
//         res.status(400).send(req.body)
//       }
//       else {
//         console.log("Deleted Subject");
//         res.status(200).send(req.body);
//       }
//     });
//   });

//   router.delete("/program/:id", (req, res) => {
//     const deleteQuery = `
//     DELETE FROM program WHERE id="${req.params.id}"
//     `;
//     connection.query(deleteQuery, (err, result) => {
//       if (err){
//         res.status(400).send(req.body)
//       }
//       else {
//         console.log("Deleted Program");
//         res.status(200).send(req.body);
//       }
//     });
//   });

//   router.delete("/person/:id", (req, res) => {
//     const deleteQuery = `
//     DELETE FROM person WHERE id="${req.params.id}"
//     `;
//     connection.query(deleteQuery, (err, result) => {
//       if (err){
//         res.status(400).send(req.body)
//       }
//       else {
//         console.log("Deleted person");
//         res.status(200).send(req.body);
//       }
//     })
//   });

//   connection.release();
// });
module.exports = router;
