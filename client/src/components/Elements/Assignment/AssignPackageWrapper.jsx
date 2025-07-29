import React from "react";
import { useNavigate } from "react-router-dom";
import AssignPackage from "./assignPackage.jsx";

const AssignPackageWrapper = (props) => {
  const navigate = useNavigate();
  return <AssignPackage {...props} navigate={navigate} />;
};

export default AssignPackageWrapper;
