import React from "react";
import "./packages.css";
import { useParams, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

const EditPackage = () => {
  const { packageID } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      console.log('Fetching package status for ID:', packageID);
      const res = await fetch(`/API/query/getOnePackage/${packageID}`);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Status fetch response:', { status: res.status, data });
      
      // Since the endpoint returns an array, take the first item
      const packageData = Array.isArray(data) ? data[0] : data;
      
      if (packageData && packageData.status) {
        console.log('Setting status to:', packageData.status);
        setStatus(packageData.status);
      } else {
        throw new Error('Invalid response format: status field missing');
      }
    } catch (err) {
      console.error('Error fetching status:', err);
      setStatus("");
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [packageID]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    try {
      const res = await fetch(`/API/query/package/${packageID}`, {
        method: "DELETE",
      });
      const text = await res.text();
      console.log('Delete response:', res.status, text);
      if (res.ok) {
        alert("Package deleted successfully.");
        navigate("/admin/packages");
      } else {
        alert(`Failed to delete package. Server response: ${res.status} ${text}`);
      }
    } catch (err) {
      alert("Error deleting package.");
    }
  };

  const fetchLatestStatus = async () => {
    try {
      const res = await fetch(`/API/query/getOnePackage/${packageID}`);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      // Since the endpoint returns an array, take the first item
      const packageData = Array.isArray(data) ? data[0] : data;
      
      if (packageData && packageData.status) {
        setStatus(packageData.status);
        return packageData.status;
      } else {
        throw new Error('Invalid response format: status field missing');
      }
    } catch (err) {
      console.error('Error fetching latest status:', err);
      throw err; // Re-throw to be handled by the caller
    }
  };

  const handleStatusChange = async (newStatus) => {
    console.log('Attempting to change status to:', newStatus);
    try {
      const res = await fetch(`/API/query/package/${packageID}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const responseData = await res.json().catch(() => ({}));
      console.log('Status update response:', { status: res.status, data: responseData });
      
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}: ${responseData.message || 'Unknown error'}`);
      }
      
      // Fetch the latest status from the database
      console.log('Fetching latest status after update...');
      await fetchLatestStatus();
      console.log('Status after update:', status);
      alert(`Status updated successfully!`);
    } catch (err) {
      console.error('Error updating status:', err);
      alert(`Error updating status: ${err.message}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Roboto, Arial, Helvetica, sans-serif' }}>
      <div style={{ background: '#fff', boxShadow: '0 6px 24px rgba(60,72,88,0.12)', borderRadius: '16px', padding: '2.5rem 2.5rem 2rem 2.5rem', minWidth: 340, maxWidth: 400, width: '100%' }}>
        <h2 style={{ color: '#1a365d', marginBottom: '2rem', letterSpacing: '0.04em', fontWeight: 700 }}>Edit Package</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <button 
            style={{ background: 'linear-gradient(90deg, #ff5858 0%)', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'transform 0.1s', boxShadow: '0 2px 8px rgba(255,88,88,0.08)' }}
            onClick={handleDelete}
          >
            Delete Package
          </button>
           {loading ? (
            <button disabled style={{ opacity: 0.6 }}>Loading...</button>
          ) : status === "Scrutinized" ? (
            <button 
              disabled 
              style={{ 
                background: 'gray', 
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '1rem', 
                fontWeight: 600 
              }}
            >
              Scrutinized
            </button>
          ) : (
            <button
              style={{ 
                background: status === "Submitted" 
                  ? 'linear-gradient(90deg, #0077b6 0%, #00b4d8 100%)' 
                  : 'linear-gradient(90deg, #38b000 0%, #70e000 100%)',
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '1rem', 
                fontWeight: 600, 
                cursor: 'pointer', 
                transition: 'transform 0.1s', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
              onClick={() => handleStatusChange(status === "Pending" ? "Submitted" : "Scrutinized")}
            >
              {status === "Pending" ? "Submit" : "Scrutinize"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPackage;