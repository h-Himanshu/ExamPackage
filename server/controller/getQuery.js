const express = require("express");
const { connectToDB } = require("../database");

const router = express.Router();

router.get("/getPendingPackages", (req, res) => {

  const pendingPackagequery = `
    SELECT 
      ass.id AS id,
      pac.packageCode,
      sub.subjectName,
      ass.dateOfAssignment,
      ass.dateOfDeadline,
  per.name,
  per.contact,
      pac.status
    FROM assignment ass
    INNER JOIN package pac ON pac.id = ass.packageID
    INNER JOIN exam ex ON ex.id = pac.examID
    INNER JOIN subject sub ON sub.id = ex.subjectID
    INNER JOIN person per ON per.id = ass.personID
    WHERE 
      ass.dateOfSubmission IS NULL
      OR (pac.status = 'Recheck' AND ass.resubmissionDate IS NULL)
    ORDER BY ass.dateOfAssignment`;
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

router.get('/getPersonSpecificPackage/:personID', (req, res) => {
  const getPersonSpecificPackage = `
    SELECT 
      pac.packageCode,
      sub.subjectName,
      ass.dateOfAssignment,
      ass.dateOfDeadline,
  -- per.email as email (removed)
    FROM assignment ass
    INNER JOIN package pac ON pac.id = ass.packageID
    INNER JOIN exam ex ON ex.id = pac.examID
    INNER JOIN subject sub ON sub.id = ex.subjectID
    INNER JOIN person per ON per.id = ass.personID
    WHERE per.id = ?
      AND (
        ass.dateOfSubmission IS NULL OR (pac.status = 'Recheck' AND ass.resubmissionDate IS NULL)
      )
    ORDER BY ass.dateOfAssignment`;

  const db = connectToDB();

  db.all(getPersonSpecificPackage, [req.params.personID], (err, rows) => {
    if (err) res.status(404).send("The data does not exist");
    else {
      res.status(200).send(JSON.parse(JSON.stringify(rows)));
      console.log(rows)
      console.log("Person Specific Packages sent");
    }

  })
  db.close(err => {
    if (err) console.log(err.message)
    console.log("Close the database connction")
  })
})
router.get("/getPendingExamPackages/:id", (req, res) => {

  const pendingPackagequery = `
    SELECT 
      ass.id AS id,
      pac.packageCode,
      sub.subjectName,
      ass.dateOfAssignment,
      ass.dateOfDeadline,
  per.name,
  per.contact
    FROM assignment ass
    INNER JOIN package pac ON pac.id = ass.packageID
    INNER JOIN exam ex ON ex.id = pac.examID
    INNER JOIN subject sub ON sub.id = ex.subjectID
    INNER JOIN person per ON per.id = ass.personID
    WHERE ex.id = ? AND (
      ass.dateOfSubmission IS NULL
      OR (pac.status = 'Recheck' AND ass.resubmissionDate IS NULL)
    )
    ORDER BY ass.dateOfAssignment`;

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
  const assignedQuery = `SELECT person.id, name, contact, campus, packageCode, noOfPackets, dateOfAssignment, status
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
  const getAllPerson = `SELECT id, name, contact, course_code, program, year_part, subject, campus FROM person`;

  const db = connectToDB();
  db.all(getAllPerson, [], (err, rows) => {
    if (err) {
      res.status(404).send("The data does not exist");
    } else {
      // Remove floating point from contact numbers if any
      const processedRows = rows.map(row => {
        if (row.contact !== undefined && row.contact !== null) {
          row.contact = String(row.contact).replace(/\.0$/, "");
        }
        return row;
      });
      res.status(200).send(JSON.parse(JSON.stringify(processedRows)));
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
    (s.subjectName || '-' || e.date) as exam, 
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
  const getPack = `SELECT p.id, subjectName, subjectName || '-' || date as examName, examType, packageCode, noOfCopies, codeStart || ' - ' || codeEnd as codeRange FROM package as p JOIN exam as
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
  //   const getPack = `SELECT  pac.id AS package_id, yearPart, subjectName, examType, pac.packageCode, pac.noOfCopies, pac.codeStart || ' - ' || pac.codeEnd as codeRange FROM package pac INNER JOIN
  //   (SELECT concat(year,'/',part) as yearPart, ex.id AS exam_id, ex.examType, sub.subjectName FROM subject sub INNER JOIN exam ex ON ex.subjectID = sub.id )
  // AS exam_sub ON exam_sub.exam_id = pac.examID`;

  const getPack = `SELECT   pac.id AS id, subjectName, courseCode, subjectName || '-' || date as exam, examType, 
    pac.packageCode, pac.noOfCopies, pac.codeStart || ' - ' || pac.codeEnd as codeRange, pac.status,
  per.name as examinerName, per.contact as examinerContact, ass.dateOfSubmission, ass.resubmissionDate
    FROM package pac 
    INNER JOIN (
      SELECT ex.id AS exam_id, ex.date, ex.examType, sub.subjectName, sub.courseCode 
      FROM subject sub 
      INNER JOIN exam ex ON ex.subjectID = sub.id 
    ) AS exam_sub ON exam_sub.exam_id = pac.examID
    LEFT JOIN assignment ass ON ass.packageID = pac.id
    LEFT JOIN person per ON per.id = ass.personID`;

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
  const getOnePerson = `SELECT *, campus as college FROM person WHERE person.id = ? `;

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
  SELECT *, s.subjectName || '-' || e.date as exam FROM package p 
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
  const getOneAssignment = `SELECT packageCode, contact, dateOfSubmission, dateOfAssignment, name, dateofDeadline as dateOfDeadline, package.status as status 
  from assignment JOIN person JOIN package 
  where personID = person.id and packageID = package.id and assignment.id =?; `;
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

router.get("/getPackageStatusCounts", (req, res) => {
  const db = connectToDB();
  const statuses = [
    "Submitted",
    "Pending",
    "Not Assigned",
    "Scrutinized",
    "Recheck"
  ];
  const counts = {};
  let completed = 0;
  statuses.forEach((status) => {
    db.get(
      "SELECT COUNT(*) as count FROM package WHERE status = ?",
      [status],
      (err, row) => {
        counts[status] = row ? row.count : 0;
        completed++;
        if (completed === statuses.length) {
          res.status(200).json(counts);
          db.close();
        }
      }
    );
  });
});

// Fetch all data from package and assignment table for a given package id
router.get("/getPackageAndAssignment/:id", (req, res) => {
  const db = connectToDB();
  const packageId = req.params.id;
  const query = `
    SELECT pac.*, ass.*, exam_sub.subjectName, exam_sub.courseCode, exam_sub.date, exam_sub.examType,
  per.name as examinerName, per.contact as examinerContact
    FROM package pac
    INNER JOIN (
      SELECT ex.id AS exam_id, ex.date, ex.examType, sub.subjectName, sub.courseCode
      FROM subject sub
      INNER JOIN exam ex ON ex.subjectID = sub.id
    ) AS exam_sub ON exam_sub.exam_id = pac.examID
    LEFT JOIN assignment ass ON ass.packageID = pac.id
    LEFT JOIN person per ON per.id = ass.personID
    WHERE pac.id = ?
  `;
  db.all(query, [packageId], (err, rows) => {
    if (err) {
      res.status(500).send("Error fetching package and assignment data");
    } else {
      res.status(200).json(rows);
    }
  });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
  });
});

module.exports = router;
