import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ECGChart from './ECGChart';
import './App.css';

function PatientDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const patientId = location.state?.patientId;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatientData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`https://trifetch-backend.onrender.com/api/fetchdata/${patientId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching patient data:', err);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
    }
  }, [patientId, fetchPatientData]);

  return (
    <>
      <header className="App-header">
        <h1>Patient Data Dashboard</h1>
      </header>
      
      <main className="App-main">
        <div className="detail-container">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Back to Dashboard
          </button>
          
          {loading && (
            <div className="loading">Loading patient data...</div>
          )}
          
          {error && (
            <div className="error">
              <p>Error: {error}</p>
              <button onClick={fetchPatientData}>Retry</button>
            </div>
          )}
          
          {!loading && !error && !patientId && (
            <div className="error">
              <p>No patient ID provided</p>
            </div>
          )}
          
          {!loading && !error && data && patientId && (
            <div className="patient-detail-box">
              <div className="patient-info-header">
                <div className="patient-info-left">
                  <div className="info-item">
                    <span className="info-label">Patient ID:</span>
                    <span className="info-value">{data.patient_id}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Event Time:</span>
                    <span className="info-value">{data.event_time}</span>
                  </div>
                </div>
              </div>
              
              <div className="ecg-charts-layout">
                <div className="ecg-charts">
                  {data.ecg_data && data.ecg_data.length > 0 && (
                    <>
                      <ECGChart 
                        ecgData={data.ecg_data.map(d => d.value1)}
                        channelName="Lead I"
                        samplingRate={200}
                      />
                      <ECGChart 
                        ecgData={data.ecg_data.map(d => d.value2)}
                        channelName="Lead II"
                        samplingRate={200}
                      />
                    </>
                  )}
                </div>
                <div className="ecg-side-info">
                  <div className="category-badge">
                    <span className="category-label">Category</span>
                    <span className="category-value">{data.category_predicted}</span>
                  </div>
                  <div className="event-start-badge">
                    <span className="event-start-label">Event Start</span>
                    <span className="event-start-value">{data.event_start_second}s</span>
                  </div>
                  <div className={`rejection-badge ${data.is_rejected === "1" ? "rejected" : "accepted"}`}>
                    <span className="rejection-label">Status</span>
                    <span className="rejection-value">
                      {data.is_rejected === "1" ? "Rejected" : "Accepted"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default PatientDetail;
