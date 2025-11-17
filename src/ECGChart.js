import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import './ECGChart.css';

function ECGChart({ ecgData, channelName, samplingRate = 200 }) {
  // Standard ECG paper: 25 mm/sec
  // Show 6 seconds at 25mm/sec
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 1200 }); // Show 6 seconds (1200 samples at 200 samples/sec)
  const [isDragging, setIsDragging] = useState(false);
  const scrollbarRef = useRef(null);

  const totalSamples = ecgData.length;
  const visibleSamples = visibleRange.end - visibleRange.start;
  
  // Get visible data slice with time in seconds (for 25mm/sec scaling)
  const visibleData = ecgData.slice(visibleRange.start, visibleRange.end).map((point, index) => ({
    index: visibleRange.start + index,
    time: (visibleRange.start + index) / samplingRate, // time in seconds
    value: point
  }));

  // Mini chart data - downsample for performance (show every 10th point)
  const miniChartData = ecgData.filter((_, index) => index % 10 === 0).map((point, index) => ({
    index: index,
    value: point
  }));

  // Calculate scrollbar dimensions
  const scrollbarWidth = scrollbarRef.current ? scrollbarRef.current.offsetWidth : 1000;
  const thumbWidth = Math.max((visibleSamples / totalSamples) * scrollbarWidth, 30);
  const thumbPosition = (visibleRange.start / totalSamples) * scrollbarWidth;

  const handleScrollbarMouseDown = (e) => {
    setIsDragging(true);
    handleScrollbarMove(e);
  };

  const handleScrollbarMove = (e) => {
    if (!scrollbarRef.current) return;
    
    const rect = scrollbarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / scrollbarWidth));
    
    const newStart = Math.floor(percentage * totalSamples);
    const newEnd = Math.min(newStart + visibleSamples, totalSamples);
    
    setVisibleRange({ start: newStart, end: newEnd });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        handleScrollbarMove(e);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  return (
    <div className="ecg-chart-container">
      <div className="ecg-header">
        <h3>{channelName}</h3>
      </div>
      
      <div className="ecg-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={visibleData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid 
              stroke="#e8a5a5" 
              strokeWidth={0.5}
              strokeDasharray="0"
            />
            <XAxis 
              dataKey="time" 
              type="number"
              domain={[visibleRange.start / samplingRate, visibleRange.end / samplingRate]}
              hide={true}
            />
            <YAxis 
              type="number"
              domain={[1400, 1600]}
              hide={true}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#1a1a1a" 
              strokeWidth={1}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div 
        className="ecg-scrollbar" 
        ref={scrollbarRef}
        onMouseDown={handleScrollbarMouseDown}
      >
        <div className="ecg-mini-chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={miniChartData}
              margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
            >
              <YAxis 
                domain={['dataMin', 'dataMax']}
                hide={true}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#000" 
                strokeWidth={1}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div 
          className="ecg-scrollbar-thumb"
          style={{
            width: `${thumbWidth}px`,
            left: `${thumbPosition}px`
          }}
        />
      </div>
    </div>
  );
}

export default ECGChart;
