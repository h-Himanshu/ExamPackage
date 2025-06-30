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
INSERT INTO "admin" VALUES (1,'admin','21232f297a57a5a743894a0e4a801fc3',NULL,NULL);

INSERT INTO "person" VALUES (1,'Aman Gupta','9868608154','gupta@email.co',1);

INSERT INTO "college" VALUES (1,'PULCHOWK CAMPUS');
INSERT INTO "college" VALUES (2,'PURWANCHAL CAMPUS (ERC)');
INSERT INTO "college" VALUES (3,'PASCHIMANCHAL CAMPUS (WRC)');
INSERT INTO "college" VALUES (4,'THAPATHALI CAMPUS');
INSERT INTO "college" VALUES (5,'CHITWAN ENGINEERING CAMPUS, RAMPUR');
INSERT INTO "college" VALUES (6,'KATHMANDU ENGINEERING COLLEGE');
INSERT INTO "college" VALUES (7,'ADVANCED COLLEGE OF ENGINEERING AND MANAGEMENT');
INSERT INTO "college" VALUES (8,'HIMALAYA COLLEGE OF ENGINEERING');
INSERT INTO "college" VALUES (9,'KANTIPUR ENGINEERING COLLEGE');
INSERT INTO "college" VALUES (10,'KATHFORD INTERNATIONAL COLLEGE');
INSERT INTO "college" VALUES (11,'KHWOPA COLLEGE OF ENGINEERING');
INSERT INTO "college" VALUES (12,'LALITPUR ENGINEEERING COLLEGE');
INSERT INTO "college" VALUES (13,'NATIONAL COLLEGE OF ENGINEERING');
INSERT INTO "college" VALUES (14,'SAGARMATHA ENGINEERING COLLEGE');
INSERT INTO "college" VALUES (15,'JANAKPUR ENGINEERING COLLEGE');

INSERT INTO "department" VALUES (1,'Department of Civil Engineering');
INSERT INTO "department" VALUES (2,'Department of Architecture');
INSERT INTO "department" VALUES (3,'Department of Electronics  and Computer Engineering');
INSERT INTO "department" VALUES (4,'Department of Aerospace Engineering');
INSERT INTO "department" VALUES (5,'Department of Electrical Engineering');
INSERT INTO "department" VALUES (6,'Department of Mechanical Engineering');
INSERT INTO "department" VALUES (7,'Department of Applied Science and Chemical Engineering');
INSERT INTO "department" VALUES (8,'Department of Automobile Engineering');
INSERT INTO "department" VALUES (9,'Department of Agriculture Engineering');
INSERT INTO "department" VALUES (10,'Department of Geomatics Engineering');
INSERT INTO "department" VALUES (11,'Department of Industrial Engineering');


INSERT INTO "program" VALUES (1,'BCE','Bachelors',1);
INSERT INTO "program" VALUES (2,'BArch','Bachelors',2);
INSERT INTO "program" VALUES (3,'BCT','Bachelors',3);
INSERT INTO "program" VALUES (4,'BECIE','Bachelors',3);
INSERT INTO "program" VALUES (5,'BAE','Bachelors',4);


INSERT INTO "subject" VALUES (1,'CE504',NULL,NULL,3,'Fluid Mechanics');
INSERT INTO "subject" VALUES (2,'CT521',NULL,NULL,5,'Database Management System');

INSERT INTO "exam" VALUES (3,2,'Regular','2077/12/20');
INSERT INTO "exam" VALUES (4,1,'Regular','2077/11/3');

INSERT INTO "current_session" VALUES (2,'077-falgun-part-II');

INSERT INTO "package" VALUES (1,'MD521',48,'41','89',3,'Submitted');

INSERT INTO "assignment" VALUES (13,'2077/11/9','2077/11/09','2077/11/29',1,1);
INSERT INTO "assignment" VALUES (14,'2077/11/9',NULL,'2077/11/29',2,1);
COMMIT;
