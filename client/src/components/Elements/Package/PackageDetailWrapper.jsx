import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BreadCrumb from "../../Widgets/Breadcrumb/breadcrumb.jsx";
import PackageDetail from "./PackageDetail.jsx";

const PackageDetailWrapper = () => {
  const { packageId } = useParams();
  const [packageData, setPackageData] = useState(null);

  useEffect(() => {
    fetch(`/API/query/getPackageById/${packageId}`)
      .then((res) => res.json())
      .then((data) => setPackageData(data))
      .catch(() => setPackageData(null));
  }, [packageId]);

  return (
    <>
     <BreadCrumb
        breadcrumbItems={[
          { text: "Packages", link: "/admin/packages" },
          { text: "View-Package", link: "/admin/packages/view-packages" },
          { text: "Details", link: `/admin/packages/view-package/${packageId}` },
        ]}
        />
        <h3>Package Details</h3>
    <div className="container mt-4">
      <PackageDetail packageData={packageData} />
    </div>
    </>
  );
};

export default PackageDetailWrapper;
