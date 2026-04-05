import React, { useEffect, useState } from 'react';
import axios from 'axios';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:8000/history/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(response.data.history);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <div className="text-center p-10">Loading your history...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Your Analysis History</h2>
      {history.length === 0 ? (
        <p className="text-gray-500">No previous scans found. Upload a resume to get started!</p>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="border p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-500">{item.timestamp}</span>
              </div>
              <p className="text-gray-700 italic text-sm mb-3">"{item.preview}"</p>
              <details className="cursor-pointer">
                <summary className="text-blue-500 font-medium hover:underline">View Full Analysis</summary>
                <div className="mt-4 p-4 bg-gray-50 rounded border-t whitespace-pre-wrap text-sm text-gray-800">
                  {item.analysis}
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;