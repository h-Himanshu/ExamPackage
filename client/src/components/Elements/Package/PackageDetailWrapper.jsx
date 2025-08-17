import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
    <div className="container mt-4">
      <h3>Package Details</h3>
      <PackageDetail packageData={packageData} />
    </div>
  );
};

export default PackageDetailWrapper;
