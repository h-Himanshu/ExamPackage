import React, { useState, useEffect } from "react";
import { createBrowserRouter } from "react-router-dom";

//HOC
import Layout from "./hoc/layout.jsx";
// Components
import Home from "./components/Home/home.jsx";

import AddPackage from "./components/Elements/Package/addpackage.jsx";
import EditPackage from "./components/Elements/Package/editpackage.jsx";
import Intermediate from "./components/Elements/Assignment/intermediate.jsx";
import AssignPackage from "./components/Elements/Assignment/assignPackage.jsx";
import PackageHome from "./components/Elements/Package/packageHome.jsx";
// import PackageHistory from "./components/Elements/Package/History/packageModal.js";
import ReceivePackage from "./components/Elements/Package/receivePackage.jsx";

import AddNewExam from "./components/Elements/Exam/addExam.jsx";
import ExamTable from "./components/Elements/Exam/examTable.jsx";
import ExamDetails from "./components/Elements/Exam/examDetails.jsx";

import Department from "./components/Elements/Department/departmentHome.jsx";
import AddDepartment from "./components/Elements/Department/addDepartment.jsx";

import Subject from "./components/Elements/Subjects/subjectTable.jsx";
import AddNewSubject from "./components/Elements/Subjects/addSubject.jsx";

import Person from "./components/Elements/Person/person.jsx";

import Program from "./components/Elements/Program/programTable.jsx";
import AddNewProgram from "./components/Elements/Program/addProgram.jsx";

import Delete from "./components/Elements/Delete.jsx";

import Test from "./components/Widgets/test.jsx";
import Login from "./components/Elements/Login/login.jsx";
import Session from "./components/Elements/Session/Session.jsx";

import Teacher from "./pages/teacher/index.jsx"

import adbs from "ad-bs-converter";


const loader = async ( {params} ) =>{
  const teacherID = params.teacherID
  const result = await fetch( `/API/query/getPersonSpecificPackage/${teacherID}`)
  if( result.ok )
  {
    const jsonResult = await result.json();
    const parseDate = (str)=>{
      //Convert to english
      const englishDate = adbs.bs2ad(str);
      return new Date(englishDate.year, englishDate.month - 1, englishDate.day);
    }
    const findDateDifference = (myDate) => {
      const now = new Date();
      now.setHours(0, 0, 0);
    // Discard the time and time-zone information.
      const utc1 = Date.UTC(
      myDate.getFullYear(),
      myDate.getMonth(),
      myDate.getDate()
    );
    const utc2 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((utc1 - utc2) / (1000 * 60 * 60 * 24));
  }
  
  jsonResult.forEach( ( element ) =>{
    const myDate = parseDate( 
      element["dateOfDeadline"].split("T")[0].replaceAll("-", "/")
      )
      const diff = findDateDifference(myDate );
      element["Overdue"] = { isOverdue: diff < 0, days: Math.abs(diff) };
      element["status"] = diff < 0 ? "Overdue" : "Pending";
      element["dateOfDeadline"] = element["dateOfDeadline"].split("T")[0];
      element["dateOfAssignment"] = element["dateOfAssignment"].split("T")[0];
      
    })
    return jsonResult
  }
  return null  
}
const router = createBrowserRouter([
  {
    path: '/',
    element: <Login/>
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/teacher/:teacherID',
    loader: loader,
    element: <Teacher />
  },
  {
    path: '/admin',
    element: <Layout />,
    children: [
      {
        path: '/admin',
        element: <Home />
      },
      {
        path: '/admin/packages',
        element: <PackageHome />
      },
      {
        path: '/admin/add-new-package',
        element: <AddPackage />
      },
      {
        path: '/admin/edit-package/:packageID',
        element: <EditPackage />
      },
      {
        path: '/admin/assign-package/:personID',
        element: <AssignPackage />,
      },
      {
        path: "/admin/intermediate",
        element: <Intermediate />,
      },
      {
        path: "/admin/receivePackage/:assignmentID",
        element: <ReceivePackage />,
      },
      {
        path: '/admin/exams',
        element: <ExamTable />
      },
      {
        path: "/admin/add-new-exam",
        element: <AddNewExam />,
      },
      {
        path: "/admin/edit-exam/:examID",
        element: <AddNewExam />,
      },
      {
        path: "/admin/exam-details/:examID",
        element: <ExamDetails />,
      },
      {
        path: "/admin/edit-person/:personID",
        element: <Person />,
      },
      {
        path: '/admin/add-new-person',
        element: <Person />
      },
      {
        path: '/admin/subjects',
        element: <Subject />,
      },
      {
        path: "/admin/add-new-subject",
        element: <AddNewSubject />,
      },
      {
        path: "/admin/edit-subject/:subjectID",
        element: <AddNewSubject />,
      },
      {
        path: "/admin/departments",
        element: <Department />,
      },
      {
        path: '/admin/add-new-department',
        element: <AddDepartment />,
      },
      {
        path: '/admin/edit-department/:departmentID',
        element: <AddDepartment />,
      },
      {
        path: '/admin/add-new-program',
        element: <AddNewProgram />,
      },
      {
        path: '/admin/edit-program/:programID',
        element: <AddNewProgram />
      },
      {
        path: '/admin/programs',
        element: <Program />
      },
      {
        path: '/admin/session',
        element: <Session />
      },
      {
        path: '/admin/test',
        element: <Test />
      },
      {
        path: '/admin/delete/:type/:id',
        element: <Delete />
      },
      {
        path: '*',
        element: <h1>404 Not Found</h1>
      }
    ]
  },
]);

export default router;



