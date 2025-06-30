BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "admin" (
	"id"	INTEGER,
	"username"	TEXT,
	"password"	TEXT,
	"fullName"	TEXT,
	"position"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "person" (
	"id"	INTEGER NOT NULL,
	"fullName"	TEXT NOT NULL,
	"contact"	TEXT NOT NULL,
	"email"	TEXT,
	"collegeID"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("collegeID") REFERENCES "college"("id")
);
CREATE TABLE IF NOT EXISTS "college" (
	"id"	INTEGER,
	"collegeName"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "department" (
	"id"	INTEGER NOT NULL,
	"departmentName"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "program" (
	"id"	INTEGER NOT NULL,
	"programName"	TEXT NOT NULL,
	"academicDegree"	TEXT NOT NULL CHECK("academicDegree" IN ('Bachelors', 'Masters')),
	"departmentID"	INT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("departmentID") REFERENCES "department"("id")
);
CREATE TABLE IF NOT EXISTS "subject" (
	"id"	INTEGER NOT NULL,
	"courseCode"	TEXT NOT NULL,
	"year"	TEXT CHECK("year" IN ('I', 'II', 'III', 'IV')),
	"part"	TEXT CHECK("year" IN ('I', 'II')),
	"programID"	INT NOT NULL,
	"subjectName"	TEXT,
	FOREIGN KEY("programID") REFERENCES "program"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "exam" (
	"id"	INTEGER NOT NULL,
	"subjectID"	INTEGER NOT NULL,
	"examType"	TEXT NOT NULL DEFAULT 'Regular' CHECK("examType" IN ('Regular', 'Back')),
	"date"	TEXT,
	FOREIGN KEY("subjectID") REFERENCES "subject"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "current_session" (
	"id"	INTEGER NOT NULL,
	"sessionName"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "package" (
	"id"	INTEGER NOT NULL,
	"packageCode"	TEXT UNIQUE,
	"noOfCopies"	INT,
	"codeStart"	TEXT,
	"codeEnd"	TEXT,
	"examID"	INT,
	"status"	TEXT NOT NULL DEFAULT 'Not Assigned' CHECK("status" IN ('Not Assigned', 'Pending', 'Submitted')),
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("examID") REFERENCES "exam"("id")
);
CREATE TABLE IF NOT EXISTS "assignment" (
	"id"	INTEGER NOT NULL,
	"dateOfAssignment"	TEXT,
	"dateOfSubmission"	TEXT,
	"dateOfDeadline"	TEXT,
	"packageID"	INTEGER UNIQUE,
	"personID"	INT,
	FOREIGN KEY("packageID") REFERENCES "package"("id"),
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("personID") REFERENCES "person"("id")
);
COMMIT;
