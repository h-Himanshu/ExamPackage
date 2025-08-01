const express = require("express");
const { connectToDB } = require("../database");

const router = express.Router();

router.get("/getPendingPackages", (req, res) => {

 const pendingPackagequery = `SELECT assignmentId AS id, packageCode, subjectName, dateOfAssignment, dateOfDeadline,  per.fullName, per.contact, per.email FROM person per INNER JOIN
		(SELECT id AS assignmentId, dateOfAssignment, dateOfDeadline, subjectName, packageCode, ass.personID AS person_id FROM assignment ass INNER JOIN
			(SELECT  pac.id AS package_id, subjectName, pac.packageCode FROM package pac INNER JOIN
				(SELECT ex.id AS exam_id, sub.subjectName FROM subject sub INNER JOIN exam ex ON ex.subjectID = sub.id )
				AS exam_sub ON exam_sub.exam_id = pac.examID)
			 AS sep ON sep.package_id = ass.packageID AND ass.dateOfSubmission IS NULL )
		 AS sepa ON sepa.person_id = per.id ORDER BY dateOfAssignment`
  const db = connectToDB();

  db.all(pendingPackagequery, [], (err, rows) => {
    if (err) {
      res.status(404).send("The data does not exist");
    } else {
      res.status(200).send(JSON.parse(JSON.stringify(rows)));
      console.log("Pending Packages returned");
    }
  });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
});

router.get( '/getPersonSpecificPackage/:personID', ( req, res ) => {
  const getPersonSpecificPackage = `SELECT packageCode, subjectName, dateOfAssignment, dateOfDeadline, per.email as email  FROM person per INNER JOIN
                                  (SELECT id AS assignmentId, dateOfAssignment, dateOfDeadline, subjectName, packageCode, ass.personID AS person_id FROM assignment ass INNER JOIN
                                    (SELECT  pac.id AS package_id, subjectName, pac.packageCode FROM package pac INNER JOIN
                                      (SELECT ex.id AS exam_id, sub.subjectName FROM subject sub INNER JOIN exam ex ON ex.subjectID = sub.id )
                                      AS exam_sub ON exam_sub.exam_id = pac.examID)
                                    AS sep ON sep.package_id = ass.packageID AND ass.dateOfSubmission IS NULL )
                                  AS sepa ON sepa.person_id = per.id 
                                  WHERE email = ?
                                  ORDER BY dateOfAssignment`
  
  const db = connectToDB();

  db.all( getPersonSpecificPackage, [ req.params.personID], ( err, rows ) =>{
    if( err ) res.status( 404 ).send("The data does not exist");
    else{
      res.status(200).send( JSON.parse(JSON.stringify(rows)));
      console.log( rows )
      console.log("Person Specific Packages sent");
    }

  })
  db.close( err =>{
    if( err ) console.log(err.message)
    console.log("Close the database connction")
  })
})
router.get("/getPendingExamPackages/:id", (req, res) => {

  const pendingPackagequery = `SELECT assignmentId AS id, packageCode, subjectName, dateOfAssignment, dateOfDeadline,  per.fullName, per.contact, per.email FROM person per INNER JOIN
		(SELECT id AS assignmentId, dateOfAssignment, dateOfDeadline, subjectName, packageCode, ass.personID AS person_id FROM assignment ass INNER JOIN
			(SELECT  pac.id AS package_id, subjectName, pac.packageCode FROM package pac INNER JOIN
				(SELECT ex.id AS exam_id, sub.subjectName FROM subject sub INNER JOIN exam ex ON ex.subjectID = sub.id where ex.id= ? )
				AS exam_sub ON exam_sub.exam_id = pac.examID)
			 AS sep ON sep.package_id = ass.packageID AND ass.dateOfSubmission IS NULL )
		 AS sepa ON sepa.person_id = per.id ORDER BY dateOfAssignment`;

  const db = connectToDB();
  db.all(pendingPackagequery, [req.params.id], (err, rows) => {
    if (err) {
      res.status(404).send("The data does not exist");
    } else {
      res.status(200).send(JSON.parse(JSON.stringify(rows)));
      console.log("Pending Packages returned");
    }
  });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
});

router.get("/getAssignments", (req, res) => {
  const assignedQuery = `SELECT person.id, fullName, contact, address, packageCode, noOfPackets, dateOfAssignment, status
          FROM person JOIN
          (
            SELECT a.id, dateOfAssignment, dateOfSubmission, noOfPackets, personID, packageCode, status
            FROM assignment as a JOIN package as p
            ON a.packageID=p.id
          ) AS asgn
          ON person.id = asgn.personID`;
          
          const db = connectToDB();
          db.all(assignedQuery, [], (err, rows) => {
            if (err) {
              res.status(404).send("The data does not exist");
            } else {
              res.status(200).send(JSON.parse(JSON.stringify(rows)));
              console.log("Assignments returned");
            }
          });
          db.close((err) => {
            if (err) {
              console.error(err.message);
            }
            console.log("Close the database connection.");
          });
        });
        
router.get("/getExams", (req, res) => {
  
  const examGetterQuery = `SELECT exam.id, exam.date, exam.examType, exam.subjectID , subject.subjectName,
  courseCode, programName
  FROM exam JOIN (subject JOIN program ON programID=program.id) ON subjectID = subject.id;`;
  
  const db = connectToDB();
  db.all(examGetterQuery, [], (err, rows) => {
    if (err) {
      res.status(404).send("The data does not exist");
    } else {
      res.status(200).send(JSON.parse(JSON.stringify(rows)));
      console.log("Exams returned");
    }
  });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
});

router.get("/getExams/:id", (req, res) => {
  // const examGetterQuery = `SELECT subjectID, exam.id, exam.date, exam.examType, courseCode, year, part, programName
  //       FROM exam JOIN (subject JOIN program ON programID=program.id) ON subjectID = subject.id WHERE exam.id = '${req.params.id}'`;

  const examGetterQuery = `SELECT academicDegree, programName, subjectID, exam.id, exam.date, exam.examType, courseCode, programName
            FROM exam JOIN (subject JOIN program ON programID=program.id) ON subjectID = subject.id WHERE exam.id = ?`;

  const db = connectToDB();
  db.all(examGetterQuery, [req.params.id], (err, rows) => {
    if (err) {
      res.status(404).send("The data does not exist");
    } else {
      res.status(200).send(JSON.parse(JSON.stringify(rows)));
      console.log("Exams returned");
    }
  });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
});

router.get("/getPerson", (req, res) => {
  const getAllPerson = `SELECT p.fullName,p.contact, p.email, p.id, c.collegeName FROM person p INNER JOIN college c ON p.collegeID = c.id;`;

  const db = connectToDB();
  db.all(getAllPerson, [], (err, rows) => {
    if (err) {
      res.status(404).send("The data does not exist");
    } else {
      res.status(200).send(JSON.parse(JSON.stringify(rows)));
      console.log("Persons returned");
    }
  });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
});

router.get("/getPackages", (req, res) => {
  const getAllPackages = `SELECT * FROM package`;

  const db = connectToDB();
  db.all(getAllPackages, [], (err, rows) => {
    if (err) {
      res.status(404).send("The data does not exist");
    } else {
      res.status(200).send(JSON.parse(JSON.stringify(rows)));
      console.log("Packages returned");
    }
  });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
});

router.get("/getNotAssignedPackages", (req, res) => {
  // Updated query to include subjectName, examName, center
  const getPack = `SELECT p.id, p.packageCode, s.subjectName, 
    (s.subjectName || '-' || e.date || '-' || e.examType) as exam, 
    p.center, p.noOfCopies
    FROM package as p 
    JOIN exam as e on p.examID = e.id 
    JOIN subject as s ON e.subjectID = s.id 
    JOIN program as pr on pr.id = s.programID
    WHERE p.status = "Not Assigned"`;
  const db = connectToDB();
  db.all(getPack, [], (err, rows) => {
    if (err) {
      console.log(err)
      res.status(404).send("The data does not exist");
    } else {
      res.status(200).send(JSON.parse(JSON.stringify(rows)));
      console.log("Not Assigned Packages returned");
    }
  });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
});

router.get("/getNotAssignedExamPackages/:id", (req, res) => {
  const getPack = `SELECT p.id, subjectName, subjectName || '-' || date || '-' || examType as examName, examType, packageCode, noOfCopies,codeStart,codeEnd FROM package as p JOIN exam as
			e on p.examID = e.id JOIN subject as s ON
			e.subjectID = s.id JOIN program as pr on pr.id = s.programID
			WHERE status="Not Assigned" and e.id= ?`;

  const db = connectToDB();
  db.all(getPack, [req.params.id], (err, rows) => {
    if (err) {
      res.status(404).send("The data does not exist");
    } else {
      res.status(200).send(JSON.parse(JSON.stringify(rows)));
      console.log("Not Assigned Exam Packages returned");
    }
  });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
});

router.get("/getAllPackages", (req, res) => {
  //   const getPack = `SELECT  pac.id AS package_id, yearPart, subjectName, examType, pac.packageCode, pac.noOfCopies, pac.codeStart, pac.codeEnd FROM package pac INNER JOIN
  //   (SELECT concat(year,'/',part) as yearPart, ex.id AS exam_id, ex.examType, sub.subjectName FROM subject sub INNER JOIN exam ex ON ex.subjectID = sub.id )
  // AS exam_sub ON exam_sub.exam_id = pac.examID`;

  const getPack = `SELECT   pac.id AS id, subjectName, courseCode, subjectName || '-' || date || '-' || examType as exam, examType, pac.packageCode, pac.noOfCopies, pac.codeStart, pac.codeEnd, pac.status FROM package pac INNER JOIN
    (SELECT ex.id AS exam_id, ex.date, ex.examType, sub.subjectName, sub.courseCode FROM subject sub INNER JOIN exam ex ON ex.subjectID = sub.id )
  AS exam_sub ON exam_sub.exam_id = pac.examID`;

  const db = connectToDB();
  db.all(getPack, [], (err, rows) => {
    if (err) {
      res.status(404).send("The data does not exist");
    } else {
      res.status(200).send(JSON.parse(JSON.stringify(rows)));
      console.log("All Packages returned");
    }
  });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
});


router.get("/getOnePerson/:id", (req, res) => {
  const getOnePerson = `SELECT *,college.collegeName as college FROM person join college on person.collegeID=college.id WHERE person.id = ? `;

  const db = connectToDB();
  db.all(getOnePerson, [req.params.id], (err, rows) => {
    if (err) {
      res.status(404).send("The data does not exist");
    } else {
      res.status(200).send(JSON.parse(JSON.stringify(rows)));
      console.log("One Person returned");
    }
  });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
});

router.get("/getOnePackage/:id", (req, res) => {
  const getOnePackage = `
  SELECT package.*, package.packageCode, exam.*, subject.*, program.*
  FROM package 
  JOIN exam ON package.examID = exam.id 
  JOIN subject ON subject.id = exam.subjectID
  JOIN program ON program.id = subject.programID
  WHERE package.id = ?; `;

  const db = connectToDB();
  db.all(getOnePackage, [req.params.id], (err, rows) => {
    if (err) {
      res.status(404).send("The data does not exist");
    } else {
      res.status(200).send(JSON.parse(JSON.stringify(rows)));
      console.log("One Package returned");
    }
  });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
});

router.get("/getOnePackageByPackageCode/:code", (req, res) => {
  const getOnePackage = `
  SELECT *, s.subjectName || '-' || e.date || '-' || e.examType as exam FROM package p 
LEFT JOIN exam e on p.examID=e.id 
LEFT JOIN subject s ON e.subjectID=s.id 
LEFT JOIN assignment a ON a.packageID=p.id 
LEFT JOIN person pe on a.personID=pe.id WHERE p.packageCode="${req.params.code}";`;

  const db = connectToDB();
  db.all(getOnePackage, [], (err, rows) => {
    if (err) {
      res.status(404).send("The data does not exist");
      console.log(err)
    } else {
      res.status(200).send(JSON.parse(JSON.stringify(rows)));
      console.log("One Package by Code returned");
    }
  });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
});

router.get("/getOneDepartment/:id", (req, res) => {
  const getOneDepartment = `SELECT * FROM department WHERE id=?`;
  const db = connectToDB();
  db.all(getOneDepartment, [req.params.id], (err, rows) => {
    if (err) {
      res.status(404).send("The data does not exist");
    } else {
      res.status(200).send(JSON.parse(JSON.stringify(rows)));
      console.log("One Department returned");
    }
  });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
});

router.get("/getOneSubject/:id", (req, res) => {
  const getOneSubject = `
  SELECT * FROM subject
  JOIN program ON program.id = subject.programID
  WHERE subject.id=?
  `;
  const db = connectToDB();
  db.all(getOneSubject, [req.params.id], (err, rows) => {
    if (err) {
      res.status(404).send("The data does not exist");
    } else {
      res.status(200).send(JSON.parse(JSON.stringify(rows)));
      console.log("One Subject returned");
    }
  });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
});

router.get("/getOneAssignment/:id", (req, res) => {
  const getOneAssignment = `SELECT packageCode,  contact,dateOfSubmission, dateOfAssignment,fullName AS name,dateofDeadline as dateOfDeadline from assignment JOIN person JOIN package where personID = person.id and packageID = package.id and assignment.id =?; `;
  const db = connectToDB();
  db.all(getOneAssignment, [req.params.id], (err, rows) => {
    if (err) {
      res.status(404).send("The data does not exist");
    } else {
      res.status(200).send(JSON.parse(JSON.stringify(rows)));
      console.log("One Assigment returned");
    }
  });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
});

router.get("/getSubjectPackage/:scode", (req, res) => {
  const getSubjectPackage = `SELECT packageCode FROM package JOIN
    (
        SELECT exam.id FROM
        exam JOIN subject
        ON subjectID = subject.id
        WHERE subjectCode="?"
    ) as t
    ON examID=t.id`;

  const db = connectToDB();
  db.all(getSubjectPackage, [req.params.scode], (err, rows) => {
    if (err) {
      res.status(404).send("The data does not exist");
    } else {
      res.status(200).send(JSON.parse(JSON.stringify(rows)));
      console.log("Packages by Subject Code returned");
    }
  });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
});

router.get("/getSubjectList", (req, res) => {
  // const getAllPerson = `SELECT subject.id,subjectName,courseCode, year, part, programName FROM subject JOIN program
  // ON programID=program.id`;
  const getSubjectList = `SELECT subject.id,subjectName,courseCode, programName FROM subject JOIN program
    ON programID=program.id`;

  const db = connectToDB();
  db.all(getSubjectList, [], (err, rows) => {
    if (err) {
      res.status(404).send("The data does not exist");
    } else {
      res.status(200).send(JSON.parse(JSON.stringify(rows)));
      console.log("All Subjects returned");
    }
  });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
});

router.get("/getDepartmentList", (req, res) => {
  const getDepartmentList = `SELECT * FROM department`;
  const db = connectToDB();
  db.all(getDepartmentList, [], (err, rows) => {
    if (err) {
      res.status(404).send("The data does not exist");
    } else {
      res.status(200).send(JSON.parse(JSON.stringify(rows)));
      console.log("All Departments returned");
    }
  });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
});

router.get("/getCollegeList", (req, res) => {
  const getAllCollege = `SELECT * FROM college`;
  const db = connectToDB();
  db.all(getAllCollege, [], (err, rows) => {
    if (err) {
      res.status(404).send("The data does not exist");
    } else {
      res.status(200).send(JSON.parse(JSON.stringify(rows)));
      console.log("All Colleged returned");
    }
  });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
});
router.get("/getProgramList", (req, res) => {
  const getProgramList = `SELECT prog.id, prog.programName, prog.academicDegree, dept.departmentName FROM program prog INNER JOIN department dept WHERE prog.departmentID = dept.id`;
  const db = connectToDB();
  db.all(getProgramList, [], (err, rows) => {
    if (err) {
      res.status(404).send("The data does not exist");
    } else {
      res.status(200).send(JSON.parse(JSON.stringify(rows)));
      console.log("All Programs retuned");
    }
  });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
});

router.get("/getProgram/:id", (req, res) => {
  const getOneProgram = `SELECT * FROM program WHERE id = ?`;

  const db = connectToDB();
  db.all(getOneProgram, [req.params.id], (err, rows) => {
    if (err) {
      res.status(404).send("The data does not exist");
    } else {
      res.status(200).send(JSON.parse(JSON.stringify(rows)));
      console.log("One Program by Code returned");
    }
  });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
});

// Get all departments
router.get("/getDepartments", (req, res) => {
  const db = require("../database").connectToDB();
  const sql = "SELECT * FROM department";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Database error: " + err.message });
      return;
    }
    res.json(rows);
  });
  db.close();
});

module.exports = router;
