import React, { useEffect, useState } from "react";
import "./dashboard.css";
import BreadcrumSection from "../Widgets/Breadcrumb/breadcrumb.jsx";


const statusLabels = {
  "Submitted": { label: "Submitted", icon: "\u2705" }, // ✅
  "Pending": { label: "Pending", icon: "\u23F3" }, // ⏳
  "Not Assigned": { label: "Not Assigned", icon: "\u2753" }, // ❓
  "Scrutinized": { label: "Scrutinized", icon: "\uD83D\uDCDD" }, // 📝
  "Recheck": { label: "Recheck", icon: "\uD83D\uDD04" } // 🔄
};

export default function Dashboard() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/API/query/getPackageStatusCounts")
      .then((res) => res.json())
      .then((data) => {
        setCounts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load stats");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard-stats">
      <BreadcrumSection breadcrumbItems={[{ text: "Dashboard", link: "/admin/dashboard" }]} />
      <h2>Package Status Overview</h2>
      <div className="dashboard-cards">
        {Object.keys(statusLabels).map((status) => (
          <div className="dashboard-card" key={status}>
            <span className="dashboard-icon" aria-label={statusLabels[status].label}>
              {statusLabels[status].icon}
            </span>
            <h3>{statusLabels[status].label}</h3>
            <p>{counts[status] || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
