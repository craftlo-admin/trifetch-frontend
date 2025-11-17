import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData(limit, currentPage);
  }, [limit, currentPage]);

  const fetchData = async (limitValue, page) => {
    try {
      setLoading(true);
      setError(null);
      const offset = (page - 1) * limitValue;
      const response = await fetch(`http://localhost:8000/api/fetchdata?limit=${limitValue}&offset=${offset}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setData(result.data);
        setTotalPages(result.total_pages || 1);
        setTotalCount(result.total_count || 0);
      } else {
        throw new Error(result.message || 'Invalid response format');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePatientClick = (patientId) => {
    navigate('/event_detail', { state: { patientId } });
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          className="page-btn"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          &laquo;
        </button>
      );
    }
    
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          className="page-btn"
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="page-ellipsis">...</span>);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`page-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="page-ellipsis">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          className="page-btn"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }
    
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          className="page-btn"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          &raquo;
        </button>
      );
    }
    
    return pages;
  };

  return (
    <>
      <header className="App-header">
        <h1>Patient Data Dashboard</h1>
      </header>
      
      <main className="App-main">
        {loading && (
          <div className="loading">Loading data...</div>
        )}
        
        {error && (
          <div className="error">
            <p>Error: {error}</p>
            <button onClick={() => fetchData(limit, currentPage)}>Retry</button>
          </div>
        )}
        
        {!loading && !error && data.length === 0 && (
          <div className="no-data">No data available</div>
        )}
        
        {!loading && !error && data.length > 0 && (
          <div className="table-container">
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient Name :</th>
                    <th>Device :</th>
                    <th>Event :</th>
                    <th>Event Time :</th>
                    <th>Time in Queue (Practice) :</th>
                    <th>Technician :</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <span 
                          className="patient-name-link"
                          onClick={() => handlePatientClick(item.patient_name)}
                        >
                          {item.patient_name}
                        </span>
                      </td>
                      <td>{item.device}</td>
                      <td>
                        <span className={item.is_rejected === "1" ? "event-rejected" : "event-accepted"}>
                          {item.predicted_event || item.event}
                        </span>
                      </td>
                      <td>{item.event_time}</td>
                      <td>{item.time_in_queue} days</td>
                      <td>{item.technician}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination-footer">
              <div className="pagination-info">
                Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} entries
              </div>
              <div className="pagination-pages">
                {renderPageNumbers()}
              </div>
              <div className="pagination-controls">
                <span className="pagination-label">Rows per page:</span>
                <button 
                  className={`pagination-btn ${limit === 10 ? 'active' : ''}`}
                  onClick={() => handleLimitChange(10)}
                >
                  10
                </button>
                <button 
                  className={`pagination-btn ${limit === 25 ? 'active' : ''}`}
                  onClick={() => handleLimitChange(25)}
                >
                  25
                </button>
                <button 
                  className={`pagination-btn ${limit === 50 ? 'active' : ''}`}
                  onClick={() => handleLimitChange(50)}
                >
                  50
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default Dashboard;
