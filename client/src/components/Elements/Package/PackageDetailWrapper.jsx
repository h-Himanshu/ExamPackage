import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BreadCrumb from "../../Widgets/Breadcrumb/breadcrumb.jsx";
import PackageDetail from "./PackageDetail.jsx";

const PackageDetailWrapper = () => {
  const { packageId } = useParams();


  return (
    <>
     <BreadCrumb
        breadcrumbItems={[
          { text: "Packages", link: "/admin/packages" },
          { text: "View-packages", link: "/admin/packages/view-packages" },
          { text: "Details", link: ""},
        ]}
        />
        <h3>Package Details</h3>
    <div className="container mt-4">
      <PackageDetail packageId={packageId} />
    </div>
    </>
  );
};

export default PackageDetailWrapper;
