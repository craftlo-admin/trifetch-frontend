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
      const response = await fetch(`http://localhost:8000/api/fetchdata/${patientId}`);
      
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
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default PatientDetail;
