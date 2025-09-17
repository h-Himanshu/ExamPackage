const express = require("express");
const router = express.Router();
// Bulk import persons with option to keep or replace existing data
router.post('/importPersons', (req, res) => {
  const { data, keepOld } = req.body;
  const db = connectToDB();
  db.serialize(() => {
    if (!keepOld) {
      db.run('DELETE FROM person');
    }
    const stmt = db.prepare('INSERT INTO person (name, contact, course_code, program, year_part, subject, campus) VALUES (?, ?, ?, ?, ?, ?, ?)');
    for (let i = 1; i < data.length; i++) { // skip header row
      const row = data[i];
      // console.log(`Importing row: Name=${row[1]}, Contact=${row[2]}, Course Code=${row[3]}, Program=${row[4]}, Year/Part=${row[5]}, Subject=${row[6]}, Campus=${row[7]}`);
      let contactValue = row[2];
      if (typeof contactValue === 'number') {
        contactValue = contactValue.toFixed(0); // Remove decimals if present
      }
      stmt.run(row[1], String(contactValue), row[3], row[4], row[5], row[6], row[7]);
    }
    stmt.finalize();
    db.close();
    res.json({ message: 'Person table updated successfully.' });
  });
});
const { connectToDB } = require("../database");
const { check, validationResult } = require("express-validator");
const { string } = require("joi");

router.post(
  "/addDepartment",
  [check("departmentName").exists().not().isEmpty()],
  (req, res) => {
    const db = connectToDB();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const newDepart = `INSERT INTO department(id, departmentName) VALUES (?, ?)`;

    db.run(newDepart, [null, req.body.departmentName], function (err) {
      console.log("Adding Department");
      if (err) {
        console.error(err.message);
        throw err;
      }
      console.log("Changes:", this.changes);
      db.close((err) => {
        console.log("Closing database connection.");
        if (err) {
          console.error(err.message);
        }
        res.status(200).json({ ...req.body, id: this.lastID });
      });
    });
  }
);

router.post(
  "/addSubject",
  [
    // check("year").exists().not().isEmpty(),
    check("courseCode").exists().not().isEmpty(),
    check("subjectName").exists().not().isEmpty(),
    // check("part").exists().not().isEmpty(),
    check("programID").exists().not().isEmpty(),
  ],
  (req, res) => {
    const db = connectToDB();
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const newSubject = `INSERT INTO subject(id, courseCode, subjectName, programID) VALUES (?,?,?,?)`;

    db.run(
      newSubject,
      [null, req.body.courseCode, req.body.subjectName, req.body.programID],
      function (err) {
        console.log("Adding Subject");
        if (err) {
          console.error(err.message);
          throw err;
        }
        console.log("Changes:", this.changes);
        db.close((err) => {
          console.log("Closing database connection.");
          if (err) {
            console.error(err.message);
          }
          res.status(200).json({ ...req.body, id: this.lastID });
        });
      }
    );
  }
);

router.post(
  "/addProgram",
  [
    check("programName").exists().not().isEmpty(),
    check("level").exists().not().isEmpty(),
    check("departmentID").exists().not().isEmpty(),
  ],
  (req, res) => {
    const db = connectToDB();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const newProgram = `INSERT INTO program(id, departmentID,academicDegree,programName) VALUES (?,?,?,?)`;

    db.run(
      newProgram,
      [null, req.body.departmentID, req.body.level, req.body.programName],
      function (err) {
        console.log("Adding Subject");
        if (err) {
          console.error(err.message);
          throw err;
        }
        console.log("Changes:", this.changes);
        db.close((err) => {
          console.log("Closing database connection.");
          if (err) {
            console.error(err.message);
          }
          res.status(200).json({ ...req.body, id: this.lastID });
        });
      }
    );
  }
);

router.post("/addExam",
  [
    check("subjectID").exists().not().isEmpty(),
    check("examType").exists().isIn(["Regular", "Back"]),
    check("date").exists().not().isEmpty(),
  ],
  (req, res) => {
    console.log('Request for ')
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const postExams = `INSERT INTO exam (id, subjectID, examType, date) VALUES (?,?,?,?)`;

    const db = connectToDB();

    db.run(
      postExams,
      [null, req.body.subjectID, req.body.examType, req.body.date],
      function (err) {
        console.log("Adding Exam");
        if (err) {
          console.error(err.message);
          throw err;
        }
        console.log("Changes:", this.changes);
        const examGetterQuery = `SELECT subjectID, exam.id, exam.date, exam.examType, courseCode, programName
          FROM exam JOIN (subject JOIN program ON programID=program.id) ON subjectID = subject.id WHERE exam.id =?`;

        db.get(examGetterQuery, this.lastID, (err, result) => {
          if (err) throw err;
          else {
            console.log("Exams returned!!");
            res.status(200).json({ exams: JSON.parse(JSON.stringify(result)) });
            db.close((err) => {
              console.log("Closing database connection.");
              if (err) {
                console.error(err.message);
              }
              // res.status(200).json({ ...req.body, id: this.lastID });
            });
          }
        });
      }
    );
  }
);

router.post(
  "/addPackage",
  [
    check("packageCode").exists().not().isEmpty(),
    check("noOfCopies").exists().isNumeric(),
    check("codeStart").exists().not().isEmpty(),
    check("codeEnd").exists().not().isEmpty(),
    check("center").exists().not().isEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const status = "Not assigned";
    const postNewPack = `INSERT INTO package(id, packageCode, noOfCopies, codeStart, codeEnd, examID, status, center) VALUES (?,?,?,?,?,?,?,?)`;
    const db = connectToDB();

    console.log('Request body:', req.body);
    console.log('SQL Query:', postNewPack);
    console.log('SQL Parameters:', [
      null,
      req.body.packageCode,
      req.body.noOfCopies,
      req.body.codeStart,
      req.body.codeEnd,
      req.body.examID,
      "Not Assigned",
      req.body.center
    ]);

    db.run(
      postNewPack,
      [
        null,
        req.body.packageCode,
        req.body.noOfCopies,
        req.body.codeStart,
        req.body.codeEnd,
        req.body.examID,
        "Not Assigned",
        req.body.center, 
      ],
      function (err) {
        console.log("Adding Package");
        if (err) {
          console.error(err.message);
          throw err;
        }
        console.log("Changes:", this.changes);
        db.close((err) => {
          console.log("Closing database connection.");
          if (err) {
            console.error(err.message);
          }
          res.status(200).json({ ...req.body, id: this.lastID });
        });
      }
    );
  }
);

//   router.post(
//     "/adddepartment",
//     [check("departmentname").exists().not().isempty()],
//     (req, res) => {
//       const errors = validationresult(req);
//       if (!errors.isempty()) {
//         return res.status(422).json({ errors: errors.array() });
//       }
//       const status = "not assigned";
//       const newdepart = `insert into department(id, departmentname) values
//         (${null}, '${req.body.departmentname}')`;
//       connection.query(newdepart, (err, result) => {
//         if (err) throw err;
//         else {
//           console.log(`Inserted data in department ${result}`);
//           console.log(result.insertId);
//           res
//             .status(200)
//             .json(Object.assign(req.body, { id: result.insertId }));
//         }
//       });
//     }
//   );

//   router.post(
//     "/addProgram",
//     [
//       check("programName").exists().not().isEmpty(),
//       check("level").exists().not().isEmpty(),
//       check("departmentID").exists().not().isEmpty(),
//     ],
//     (req, res) => {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(422).json({ errors: errors.array() });
//       }
//       const status = "Not assigned";
//       const newProgram = `INSERT INTO program(id, departmentID,academicDegree,programName) VALUES
//         (${null}, '${req.body.departmentID}','${req.body.level}','${
//         req.body.programName
//       }')`;
//       connection.query(newProgram, (err, result) => {
//         if (err) throw err;
//         else {
//           console.log(`Inserted data in program ${result}`);
//           console.log(result.insertId);
//           res
//             .status(200)
//             .json(Object.assign(req.body, { id: result.insertId }));
//         }
//       });
//     }
//   );

router.post(
  "/addPerson",
  [check("name").exists().not().isEmpty()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // const newPerson = `INSERT INTO person
    // (id, name, contact, courseCode,
    //   programme,
    //   year_part,
    //   subject,
    //   campus,
    //   teachingExperience,
    //   experienceinthisSubj,
    //   academicQualification,
    //   jobType,
    //   email)
    // VALUES
    //   (${null},
    //   '${req.body.name}',
    //   '${req.body.contact}',
    //   '${req.body.courseCode}',
    //   '${req.body.programme}',
    //   '${req.body.year_part}',
    //   '${req.body.subject}',
    //   '${req.body.campus}',
    //   '${req.body.teachingExperience}',
    //   '${req.body.experienceinthisSubj}',
    //   '${req.body.academicQualification}',
    //   '${req.body.jobType}',
    //   '${req.body.email}'
    
    //   )`;
    const newPerson = `INSERT INTO person (id, fullName, contact, collegeID, email) VALUES (?, ?, ?, ?, ?)`;

    const db = connectToDB();
    db.run(
      newPerson,
      [null, req.body.name, req.body.contact, req.body.campus, req.body.email],
      function (err) {
        console.log("Adding Person");
        if (err) {
          console.error(err.message);
          throw err;
        }
        console.log("Changes:", this.changes);
        db.close((err) => {
          console.log("Closing database connection.");
          if (err) {
            console.error(err.message);
          }
          res.status(200).json({ ...req.body, id: this.lastID });
        });
      }
    );
  }
);

//   router.post(
//     "/addPerson",
//     [check("name").exists().not().isEmpty()],
//     (req, res) => {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(422).json({ errors: errors.array() });
//       }

//       // const newPerson = `INSERT INTO person
//       // (id, name, contact, courseCode,
//       //   programme,
//       //   year_part,
//       //   subject,
//       //   campus,
//       //   teachingExperience,
//       //   experienceinthisSubj,
//       //   academicQualification,
//       //   jobType,
//       //   email)
//       // VALUES
//       //   (${null},
//       //   '${req.body.name}',
//       //   '${req.body.contact}',
//       //   '${req.body.courseCode}',
//       //   '${req.body.programme}',
//       //   '${req.body.year_part}',
//       //   '${req.body.subject}',
//       //   '${req.body.campus}',
//       //   '${req.body.teachingExperience}',
//       //   '${req.body.experienceinthisSubj}',
//       //   '${req.body.academicQualification}',
//       //   '${req.body.jobType}',
//       //   '${req.body.email}'

//       //   )`;
//       const newPerson = `INSERT INTO person
//       (id, fullName, contact,
//         collegeID,
//         email)
//       VALUES
//         (${null},
//         '${req.body.name}',
//         '${req.body.contact}',
//         ${req.body.campus},
//         '${req.body.email}'
//         )`;
//       connection.query(newPerson, (err, result) => {
//         if (err) throw err;
//         else {
//           console.log(`Inserted data in person ${result}`);
//           res
//             .status(200)
//             .json(Object.assign(req.body, { id: result.insertId }));
//         }
//       );
//     }
//   );

router.post("/addAssignment", (req, res) => {
  console.log("[ROUTE] /addAssignment called");
  let packageIDs = req.body.packages;
  console.log("jku");
  
  if (!packageIDs || (Array.isArray(packageIDs) && packageIDs.length === 0)) {
    return res.status(400).json({ error: "No packages provided" });
  }
  if (!Array.isArray(packageIDs)) {
    packageIDs = [packageIDs];
  }

  const db = connectToDB();
  let completed = 0;
  let errors = [];

  packageIDs.forEach((packCode) => {
  db.get(`SELECT id FROM package WHERE packageCode = ?`, [packCode], function(err, row) {
    if (err || !row) {
      console.error(`[ASSIGNMENT] No package found for packageCode=${packCode}`);
      errors.push({ packCode, error: "No package found" });
      checkDone();
      return;
    }
    const packID = row.id;
    db.run(
      `INSERT INTO assignment(dateOfAssignment, dateOfDeadline, packageID, personID) VALUES (?, ?, ?, ?)`,
      [req.body.dateOfAssignment, req.body.dateOfDeadline, packID, req.body.personID],
      function (err) {
        if (err) {
          console.error(`[ASSIGNMENT] Insert error for packageID=${packID}:`, err.message);
          errors.push({ packID, error: err.message });
          checkDone();
          return;
        }
        db.run(
          `UPDATE package SET status = 'Pending' WHERE id = ?`,
          [packID],
          function (err2) {
            if (err2) {
              console.error(`[PACKAGE] Status update failed for packageID=${packID}:`, err2.message);
              errors.push({ packID, error: err2.message });
            } else {
              console.log(`[PACKAGE] Status updated to 'Pending' for packageID=${packID}, changes=${this.changes}`);
            }
            checkDone();
          }
        );
      }
    );
  });
});

  function checkDone() {
    completed++;
    if (completed === packageIDs.length) {
      db.close((err) => {
        if (err) {
          console.error("[DB] Error closing DB:", err.message);
          errors.push({ dbClose: err.message });
        }
        if (errors.length > 0) {
          console.error("[FINAL] Errors occurred:", errors);
          return res.status(500).json({ errors });
        }
        console.log("[FINAL] All assignments and updates completed successfully.");
        res.status(200).json({ success: true });
      });
    }
  }
});

// router.post('//', ( req, res ) =>{
//   const 
//   const db = connectToDB();
//   db.exec( )

// })
//obj[0]["result on date"]

//   router.post("/addAssignment", (req, res) => {
//     const packageIDs = req.body.packages;
//     insertList = packageIDs.map((element) => {
//       return [
//         null,
//         req.body.dateOfAssignment,
//         req.body.dateOfSubmission,
//         req.body.noOfPackets,
//         element,
//         req.body.personID,
//       ];
//     });
//     console.log(insertList);

//     // const assignQ = `INSERT INTO assignment(id, dateOfAssignment, dateOfSubmission, noOfPackets, packageID, personID)
//     // VALUES (${null}, '${req.body.dateOfAssignment}', '${
//     //   req.body.dateOfSubmission
//     // }', ${req.body.noOfPackets}, ${req.body.packageID}, ${req.body.personID})`;
//     const assignQ = `INSERT INTO assignment(id, dateOfAssignment, dateOfDeadline, packageID, personID)
//     VALUES ?;
//     UPDATE package
//     SET status = 'Pending'
//     WHERE id IN (?);
//     `;
//     connection.query(assignQ, [insertList, packageIDs], (err, result) => {
//       if (err) throw err;
//       else {
//         console.log(`Inserted data in assignment ${result}`);
//         res.status(200).json(Object.assign(req.body, { id: result.insertId }));
//       }
//     });
//   });
//   //obj[0]["result on date"]

//   router.post("/postExcel", (req, res) => {
//     const xlFile = xlReader.readFile(
//       process.cwd() + "/excelFile/TeacherList.xlsx"
//     );
//     console.log(`${process.cwd()}/excelFile/TeacherList.xlsx`);
//     const JsonObj = xlParser(xlFile);
//     const JsonArray = JsonObj.ALL;

//     for (let i = 0; i < JsonArray.length; i++) {
//       const newPerson = `INSERT INTO person(id, name, contact, courseCode,
//   programme, year_part, subject, campus, teachingExperience,experienceinthisSubj, academicQualification,
//   jobType, email) VALUES
//     (${null}, '${JsonArray[i]["Name of Teacher"]}', '${
//         JsonArray[i]["Mobile No."]
//       }', '${JsonArray[i]["Course Code"]}',
//     '${JsonArray[i]["Programe"]}', '${JsonArray[i]["Year/Part"]}', '${
//         JsonArray[i]["Subject"]
//       }', '${JsonArray[i]["1 Campus Code"]}',
//      '${JsonArray[i]["Teaching Experience"]}', '${
//         JsonArray[i]["Eff. Exp. On this Subj. "]
//       }','${JsonArray[i]["Academic Qualification"]}',
//       '${
//         JsonArray[i]["Type of service: \r\n(Permanent/Contract/Part-time)"]
//       }', '${JsonArray[i]["Email"]}')`;
//       connection.query(newPerson, (err, result) => {
//         if (err) throw err;
//         else {
//           console.log(`Inserted data in person ${result}`);
//           //res.status(200).send(result);
//         }
//       });
//     }
//   });

//   connection.release();
// });

module.exports = router;
