import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import BreadCrumb from "../../Widgets/Breadcrumb/breadcrumb.jsx";
import PackageTable from "./packageTable.jsx";

const labelMap = {
  submitted: "Submitted",
  pending: "Pending",
  "not-assigned": "Not Assigned",
  scrutinized: "Scrutinized",
  recheck: "Recheck",
};

export default function PackagesByStatus() {
  const { status } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const normalized = String(status || "").toLowerCase();
  const statusLabel = labelMap[normalized] || status;

  useEffect(() => {
    // Reuse existing endpoint and filter client-side to avoid backend changes
    fetch("/API/query/getAllPackages")
      .then((res) => res.json())
      .then((json) => {
        setData(json || []);
        setLoading(false);
      })
      .catch((e) => {
        setError("Failed to load packages");
        setLoading(false);
      });
  }, [normalized]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <BreadCrumb
        breadcrumbItems={[
          { text: "Dashboard", link: "/admin/dashboard" },
          { text: `${statusLabel}`,  },
        ]}
      />
      <PackageTable initialData={data} statusFilter={statusLabel} />
    </div>
  );
}
