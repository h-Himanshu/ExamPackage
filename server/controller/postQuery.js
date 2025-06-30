const express = require("express");
const { connectToDB } = require("../database");
const { check, validationResult } = require("express-validator");
const router = express.Router();

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
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const status = "Not assigned";
    const postNewPack = `INSERT INTO package(id, packageCode, noOfCopies, codeStart, codeEnd, examID, status) VALUES (?,?,?,?,?,?,?)`;
    const db = connectToDB();

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
//       });
//     }
//   );

router.post("/addAssignment", (req, res) => {
  const packageIDs = req.body.packages;
  const db = connectToDB();


  packageIDs.map((packID) => {
    console.log(req.body.dateOfAssignment)
    const assignQ = `
    INSERT INTO assignment(dateOfAssignment, dateOfDeadline, packageID, personID)
      VALUES ("${req.body.dateOfAssignment}", "${req.body.dateOfDeadline}", ${packID}, ${req.body.personID});
    UPDATE package SET status = 'Pending'
      WHERE id = ${packID};
    `;

    db.exec(assignQ, function (err) {
      console.log("Adding Assignment");
      if (err) {
        console.error(err.message);
        throw err;
      }
      console.log("Changes:", this.changes);
    });
  });

  db.close((err) => {
    console.log("Closing database connection.");
    if (err) {
      console.error(err.message);
    }
    res.status(200).json({ ...req.body, id: this.lastID });
  });
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
//         req.body.dateOfDeadline,
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
