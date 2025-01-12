'use client';

import React from 'react';
import Image from 'next/image';


const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="header">
        <div className="title"><h1>Dashboard</h1></div>
        <div className="logo"><Image
            src="/logoye.svg"
            alt="Company Logo"
            width={200}
            height={200}
            style={{ background: "transparent" }}
          /></div>
      </div>

      <div className = "content">
      <div className="left-panel">
        <div className="graph-space">
          Graph Space
        </div>
        
        <div className="circles-container">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="circle">
              {index + 1}
            </div>
          ))}
        </div>
      </div>

        <div className="right-panel">
          <input 
            type="text"
            placeholder="Enter your question..."
            className="question-input"
          />
          <textarea 
            placeholder="Analysis will appear here..."
            className="analysis-textarea"
            readOnly
          />
        </div>
      </div>
      
      
    </div>
  );
};

export default Dashboard;