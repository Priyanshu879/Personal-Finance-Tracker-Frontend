import React, { useEffect, useState } from "react";
import axios from "axios";
import { getSuggestions } from "../utils/ApiRequest";

function SmartSuggestions({ transactions }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        getSuggestions,
        transactions,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSuggestions(res.data.suggestions);
    } catch (err) {
      console.error("Failed to fetch suggestions", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (transactions.length > 0) {
      fetchSuggestions();
    }
  }, [transactions]);

  return (
    <div className="card mt-4">
      <div className="card-header bg-info text-white">
        <h5>Smart Suggestions</h5>
      </div>
      <div className="card-body">
        {loading ? (
          <p>Loading suggestions...</p>
        ) : suggestions.length === 0 ? (
          <p>No suggestions to show.</p>
        ) : (
          <ul>
            {suggestions.map((s, idx) => (
              <li key={idx}>💡 {s}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SmartSuggestions;
