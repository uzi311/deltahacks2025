"use client"
import React, { useState, useEffect } from 'react';

const MedicalReport = () => {
  // Declare state variables to store the user's input and WebSocket status
  const [userInput, setUserInput] = useState('');
  const [pages, setPages] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    // Set up polling every 10 seconds
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:8000/latest-analysis');
        const data = await response.json();
        if (data.analysis_result) {
          setAnalysisResult(data.analysis_result);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.error('Error fetching analysis result:', error);
      }
    }, 5000); // 5 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Handle the change in the input field
  const handleChange = (e) => {
    setUserInput(e.target.value); // Update the state with the new input value
  };

  // Handle the form submission or button click
  const handleSubmit = () => {
    if (userInput.trim() !== "") {
      setPages([...pages, userInput]);
      setUserInput('');
      
      if (socketConnected) {
        // Send the user input to the server if the socket is connected
        socket.send(userInput);
      } else {
        console.log('WebSocket is not connected. Cannot send message.');
      }
    }
  };

  return (
    <div className="report-container">
      {/* Report Card */}
      <div className="report-card">
        {/* Header Section */}
        <div className="section header">
          <h1 className="report-title">Medical Report</h1>
          <p>Date: _________________</p>
          <p>Report ID: ____________</p>
          <p>Doctor: _________________</p>
          <p>License #: ______________</p>
          <p>{analysisResult ? analysisResult : 'Waiting for analysis...'}</p>
        </div>

        {/* Therapist's Question */}
        <div className="section">
          <div className="main-header">
            <h1>Response 1</h1>
          </div>
          <h2 className="section-title">Therapist's Question</h2>
          <textarea
            value={userInput}          // The value of the textarea is tied to userInput state
            onChange={handleChange}    // Handle input changes and update state
            className="text-box"
            placeholder="Type the therapist's question here..."
          ></textarea>
        </div>
        <button onClick={handleSubmit}>Submit</button>

        {/* Analysis and Solutions */}
        <div className="section">
          <h2 className="section-title">Analysis & Solutions</h2>
          <textarea
            className="text-box"
            placeholder="Analysis and suggested solutions will appear here..."
          ></textarea>
        </div>

        {/* Brain Scan Images */}
        <div className="section">
          <h2 className="section-title">Brain Scan Images</h2>
          <div className="brain-scan-placeholder">
            <p>Placeholder for brain scan images</p>
          </div>
        </div>

        {/* Emotion Circles */}
        <div className="section">
          <h2 className="section-title">Patient's Emotions</h2>
          <div className="emotion-circles">
            <div className="emotion-circle red"></div>
            <div className="emotion-circle orange"></div>
            <div className="emotion-circle yellow"></div>
            <div className="emotion-circle green"></div>
            <div className="emotion-circle blue"></div>
          </div>
        </div>
      </div>

      {pages.length > 0 && (
        <div>
          {pages.map((page, index) => (
            <div className="report-card" key={index + 2}>
              {/* Header Section */}
              <div className="main-header">
                <h1>Response {index + 2}</h1>
              </div>
              {/* Therapist's Question */}
              <div className="section">
                <h2 className="section-title">Therapist's Question</h2>
                <textarea
                  value={userInput}
                  onChange={handleChange}
                  className="text-box"
                  placeholder="Type the therapist's question here..."
                ></textarea>
              </div>
              <button onClick={handleSubmit}>Submit</button>

              {/* Analysis and Solutions */}
              <div className="section">
                <h2 className="section-title">Analysis & Solutions</h2>
                <textarea
                  className="text-box"
                  placeholder="Analysis and suggested solutions will appear here..."
                ></textarea>
              </div>

              {/* Brain Scan Images */}
              <div className="section">
                <h2 className="section-title">Brain Scan Images</h2>
                <div className="brain-scan-placeholder">
                  <p>Placeholder for brain scan images</p>
                </div>
              </div>

              {/* Emotion Circles */}
              <div className="section">
                <h2 className="section-title">Patient's Emotions</h2>
                <div className="emotion-circles">
                  <div className="emotion-circle red"></div>
                  <div className="emotion-circle orange"></div>
                  <div className="emotion-circle yellow"></div>
                  <div className="emotion-circle green"></div>
                  <div className="emotion-circle blue"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalReport;
