const express = require("express");
const { connectToDB } = require("../database");
const router = express.Router();

// pool.getConnection((err, connection) => {
//   if (err) throw err;
//   console.log("Database Connected");

router.put("/receivePackage", (req, res) => {
  const assID = req.body.id;
  const updateSubmission = `
  UPDATE assignment SET dateOfSubmission= "${req.body.dateOfSubmission}" WHERE id=${assID};
  
  UPDATE package SET status= "Submitted" 	
    WHERE package.id = (SELECT package.id FROM package JOIN assignment 
                          ON assignment.packageID= package.id AND assignment.id = ${assID})`;

  const db = connectToDB();
  db.exec(updateSubmission, function (err) {
    console.log("Updating Package");
    if (err) {
      console.error(err.message);

      throw err;
    }
    console.log("Changes:", this.changes);
  });

  db.close((err) => {
    console.log("Closing database connection.");
    if (err) {
      console.error(err.message);
    }
    res.status(200).json({ ...req.body, id: this.lastID });
  });
});

//   router.put("/receivePackage", (req, res) => {
//     const updateSubmission = `UPDATE assignment JOIN package ON assignment.packageID=package.id
//     SET assignment.dateOfSubmission="${req.body.dateOfSubmission}",
//     package.status="Submitted"
//     WHERE assignment.id=${req.body.id}`;

//     console.log(updateSubmission);
//     connection.query(updateSubmission, (err, result) => {
//       if (err) throw err;
//       else {
//         console.log("Submission Completed!!");
//         console.log(result);
//         res.status(200).send(result);
//       }
//     });
//   });

router.put("/editPerson/:id", (req, res) => {
  // const editPersonQuery = `UPDATE person
  // SET name="${req.body.name}",
  // contact="${req.body.contact}",
  // courseCode="${req.body.courseCode}",
  // programme="${req.body.programme}",
  // year_part="${req.body.year_part}",
  // subject="${req.body.subject}",
  // campus="${req.body.campus}",
  // teachingExperience="${req.body.teachingExperience}",
  // experienceinthisSubj="${req.body.experienceinthisSubj}",
  // academicQualification="${req.body.academicQualification}",
  // jobType="${req.body.jobType}",
  // email="${req.body.email}"
  // WHERE ID = ${req.params.id}

  // `;

  const editPersonQuery = `UPDATE person SET fullName=?, contact=?, collegeID=?, email=? WHERE ID =? `;
  const db = connectToDB();
  db.run(
    editPersonQuery,
    [
      req.body.name,
      req.body.contact,
      req.body.campus,
      req.body.email,
      req.params.id,
    ],
    function (err) {
      console.log("Updating Person");
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
        console.log("this", this);
        res.status(200).json({ ...req.body, id: req.params.id });
      });
    }
  );
});

//   router.put("/editPerson/:id", (req, res) => {
//     // const editPersonQuery = `UPDATE person
//     // SET name="${req.body.name}",
//     // contact="${req.body.contact}",
//     // courseCode="${req.body.courseCode}",
//     // programme="${req.body.programme}",
//     // year_part="${req.body.year_part}",
//     // subject="${req.body.subject}",
//     // campus="${req.body.campus}",
//     // teachingExperience="${req.body.teachingExperience}",
//     // experienceinthisSubj="${req.body.experienceinthisSubj}",
//     // academicQualification="${req.body.academicQualification}",
//     // jobType="${req.body.jobType}",
//     // email="${req.body.email}"
//     // WHERE ID = ${req.params.id}

//     // `;

//     const editPersonQuery = `UPDATE person
//     SET fullName="${req.body.name}",
//     contact="${req.body.contact}",
//     collegeID="${req.body.campus}",
//     email="${req.body.email}"
//     WHERE ID = ${req.params.id}

//     `;
//     connection.query(editPersonQuery, (err, result) => {
//       if (err) throw err;
//       else {
//         console.log("Updated person");
//         res.status(200).send(req.body);
//       }
//     });
//   });

router.put("/editExam/:id", (req, res) => {
  const editExamQuery = `UPDATE exam SET subjectID =?, date =?, examType =? WHERE id=?`;

  const db = connectToDB();
  db.run(
    editExamQuery,
    [req.body.subjectID, req.body.date, req.body.examType, req.params.id],
    function (err) {
      console.log("Updating Exam");
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
        console.log("this", this);
        res.status(200).json({ ...req.body, id: req.params.id });
      });
    }
  );
});

//   router.put("/editExam/:id", (req, res) => {
//     const editExamQuery = `UPDATE exam
//     SET subjectID ="${req.body.subjectID}",
//     date ="${req.body.date}",
//     examType ="${req.body.examType}"
//     WHERE id="${req.params.id}"

//     `;
//     connection.query(editExamQuery, (err, result) => {
//       if (err) throw err;
//       else {
//         console.log("Updated exam");
//         res.status(200).send(req.body);
//       }
//     });
//   });

router.put("/editPackage/:id", (req, res) => {
  const editPackageQuery = `UPDATE package SET packageCode =?, noOfCopies =?, codeStart =?, codeEnd =?, examID =? WHERE id=?`;
  const db = connectToDB();
  db.run(
    editPackageQuery,
    [
      req.body.packageCode,
      req.body.noOfCopies,
      req.body.codeStart,
      req.body.codeEnd,
      req.body.examID,
      req.params.id,
    ],
    function (err) {
      console.log("Updating Package");
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
        console.log("this", this);
        res.status(200).json({ ...req.body, id: req.params.id });
      });
    }
  );
});

//   router.put("/editPackage/:id", (req, res) => {
//     const editPackageQuery = `UPDATE package
//     SET packageCode ="${req.body.packageCode}",
//     noOfCopies ="${req.body.noOfCopies}",
//     codeStart ="${req.body.codeStart}",
//     codeEnd ="${req.body.codeEnd}",
//     examID ="${req.body.examID}",
//     status ="${req.body.status}"
//     WHERE id="${req.params.id}"

//     `;
//     connection.query(editPackageQuery, (err, result) => {
//       if (err) throw err;
//       else {
//         console.log("Updated package");
//         res.status(200).send(req.body);
//       }
//     });
//   });

router.put("/editSubject/:id", (req, res) => {
  // const editSubjectQuery = `UPDATE subject
  // SET courseCode ="${req.body.courseCode}",
  // year ="${req.body.year}",
  // subjectName ="${req.body.subjectName}",
  // part ="${req.body.part}",
  // programID ="${req.body.programID}"
  // WHERE id="${req.params.id}"

  // `;
  const editSubjectQuery = `UPDATE subject SET courseCode =?, subjectName =?, programID =? WHERE id=?`;

  const db = connectToDB();
  db.run(
    editSubjectQuery,
    [
      req.body.courseCode,
      req.body.subjectName,
      req.body.programID,
      req.params.id,
    ],
    function (err) {
      console.log("Updating Subject");
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
        console.log("this", this);
        res.status(200).json({ ...req.body, id: req.params.id });
      });
    }
  );
});

//   router.put("/editSubject/:id", (req, res) => {
//     // const editSubjectQuery = `UPDATE subject
//     // SET courseCode ="${req.body.courseCode}",
//     // year ="${req.body.year}",
//     // subjectName ="${req.body.subjectName}",
//     // part ="${req.body.part}",
//     // programID ="${req.body.programID}"
//     // WHERE id="${req.params.id}"

//     // `;
//     const editSubjectQuery = `UPDATE subject
//     SET courseCode ="${req.body.courseCode}",
//     subjectName ="${req.body.subjectName}",
//     programID ="${req.body.programID}"
//     WHERE id="${req.params.id}"

//     `;
//     connection.query(editSubjectQuery, (err, result) => {
//       if (err) throw err;
//       else {
//         console.log("Updated Subject");
//         res.status(200).send(req.body);
//       }
//     });
//   });

router.put("/editDepartment/:id", (req, res) => {
  const editDepartmentQuery = `UPDATE department SET departmentName =? WHERE id=?`;

  const db = connectToDB();
  db.run(
    editDepartmentQuery,
    [req.body.departmentName, req.params.id],
    function (err) {
      console.log("Updating Department");
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
        console.log("this", this);
        res.status(200).json({ ...req.body, id: req.params.id });
      });
    }
  );
});

//   router.put("/editDepartment/:id", (req, res) => {
//     const editDepartmentQuery = `UPDATE department
//     SET departmentName ="${req.body.departmentName}"
//     WHERE id="${req.params.id}"

//     `;
//     connection.query(editDepartmentQuery, (err, result) => {
//       if (err) throw err;
//       else {
//         console.log("Updated department");
//         res.status(200).send(req.body);
//       }
//     });
//   });

router.put("/editProgram/:id", (req, res) => {
  const editProgramQuery = `UPDATE program SET programName =?, academicDegree =?, departmentID =? WHERE id=?`;

  const db = connectToDB();
  db.run(
    editProgramQuery,
    [
      req.body.programName,
      req.body.level,
      req.body.departmentID,
      req.params.id,
    ],
    function (err) {
      console.log("Updating Program");
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
        console.log("this", this);
        res.status(200).json({ ...req.body, id: req.params.id });
      });
    }
  );
});

//   router.put("/editProgram/:id", (req, res) => {
//     const editProgramQuery = `UPDATE program
//     SET programName ="${req.body.programName}",
//     academicDegree = "${req.body.level}",
//     departmentID ="${req.body.departmentID}"
//     WHERE id="${req.params.id}"

//     `;
//     connection.query(editProgramQuery, (err, result) => {
//       if (err) throw err;
//       else {
//         console.log("Updated Program");
//         res.status(200).send(req.body);
//       }
//     });
//   });

//   connection.release();
// });
module.exports = router;
