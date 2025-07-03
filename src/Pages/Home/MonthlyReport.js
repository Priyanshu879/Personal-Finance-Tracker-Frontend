import React, { useEffect, useState } from "react";
import axios from "axios";

const MonthlyReports = ({ userId = "default_user" }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`http://localhost:000/api/reports?user_id=${userId}`);
        setReports(res.data);
      } catch (err) {
        console.error("Error fetching reports:", err);
      }
      setLoading(false);
    };

    fetchReports();
  }, [userId]);

  return (
    <div className="card mt-4">
      <div className="card-header bg-secondary text-white">
        <h5 className="mb-0">📊 Monthly Reports</h5>
      </div>
      <div className="card-body">
        {loading ? (
          <p>Loading reports...</p>
        ) : reports.length === 0 ? (
          <p>No reports available.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>Month</th>
                  <th>Total Spent (₹)</th>
                  <th>Top Category</th>
                  <th>Overbudget Categories</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, idx) => (
                  <tr key={idx}>
                    <td>{report.month}</td>
                    <td>{report.total_spent.toFixed(2)}</td>
                    <td>{report.top_category}</td>
                    <td>
                      {report.overbudget_categories.length > 0
                        ? report.overbudget_categories.join(", ")
                        : "None"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyReports;
