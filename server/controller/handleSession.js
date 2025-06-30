const express = require("express");
const { connectToDB } = require("../database");
const fs = require("fs");
const { check } = require("express-validator");

const router = express.Router();

router.post(
  "/addNewSession",
  [check("newSessionName").exists().not().isEmpty()],
  (req, res) => {
    const db = connectToDB();
    const { newSessionName } = req.body;
    // var sessionName;
    const getSessionNameQ = `SELECT sessionName FROM current_session`;
    const readyNewSessionQ = `
      DELETE FROM assignment;
      DELETE FROM package;
      DELETE FROM exam;
      DELETE FROM current_session;
      INSERT INTO current_session(sessionName) VALUES ("${newSessionName}");
  `;
    db.get(getSessionNameQ, [], (err, row) => {
      if (err) {
        res.status(500).send("Internal Server Error While Saving Session");
        return console.error(err.message);
      }

      const oldSessionName = row.sessionName;
      epmsToArchive(oldSessionName, res);

      db.exec(readyNewSessionQ, function (err) {
        if (err) {
          res.status(500).send("Internal Server Error");
          return console.error(err.message);
        }
        console.log(`New Session is ready`);

        db.close((err) => {
          if (err) {
            console.error(err.message);
          }
          console.log("Close the database connection.");
        });
      });
    });
  }
);

router.post(
  "/loadSession",
  [check("sessionToLoad").exists().not().isEmpty()],
  (req, res) => {
    const { sessionToLoad } = req.body;

    const db = connectToDB();
    const getSessionNameQ = `SELECT sessionName FROM current_session`;

    db.get(getSessionNameQ, [], (err, row) => {
      if (err) {
        res.status(500).send("Internal Server Error While Saving Session");
        return console.error(err.message);
      }

      const oldSessionName = row.sessionName;
      epmsToArchive(oldSessionName, res);
      archiveToEpms(sessionToLoad);
    });

    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Close the database connection.");
    });
  }
);

router.get("/getOldArchives", (req, res) => {
  const files = fs.readdirSync("db");
  const index = files.indexOf("EPMS.sqlite3");

  if (index > -1) {
    files.splice(index, 1);
  }

  files.forEach((item, index, arr) => {
    arr[index] = item.split(".")[0];
  });

  res.status(200).send(JSON.parse(JSON.stringify(files)));
  return;
});

router.get("/getSessionName", (req, res) => {
  const db = connectToDB();
  const getSessionNameQ = `SELECT sessionName FROM current_session`;

  db.get(getSessionNameQ, [], (err, row) => {
    if (err) {
      res.status(500).send("Cannot find the required data");
      return console.error(err.message);
    }
    const {sessionName} = row 
    res.status(200).send(JSON.parse(JSON.stringify({sessionName})));
  });
});


// UTILITY FUNCTIONS

const epmsToArchive = (archiveName, res) => {
  fs.copyFile("db/EPMS.sqlite3", `db/${archiveName}.sqlite3`, (err) => {
    if (err) {
      res.status(500).send("Error");
      return;
    }
    console.log("File was copied to destination");
  });
};

const archiveToEpms = (archiveName, res) => {
  fs.copyFile(`db/${archiveName}.sqlite3`, "db/EPMS.sqlite3", (err) => {
    if (err) {
      // res.status(500).send("Error");
      return;
    }
    console.log("File was copied to destination");
    // res.status(200).send("Success")
  });
};

module.exports = router;
