// MedicalReport.jsx
import React from 'react';
import "C:/Users/emad_/Downloads/properdeltahacks/src/app/globals.css";

const MedicalReport = () => {
  return (
    <div className="report-container">
      <div className="report-card">
        {/* Header Section */}
        <div className="section header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="report-title">Medical Report</h1>
              <p>Date: _________________</p>
              <p>Report ID: ____________</p>
            </div>
            <div className="header-right">
              <p>Doctor: _________________</p>
              <p>License #: ______________</p>
            </div>
          </div>
        </div>

        {/* Patient Information */}
        <div className="section">
          <h2 className="section-title">Patient Information</h2>
          <div className="grid-2">
            <p>Name: _________________</p>
            <p>DOB: _________________</p>
            <p>Gender: _______________</p>
            <p>MRN: _________________</p>
          </div>
        </div>

        {/* Clinical Information */}
        <div className="section">
          <h2 className="section-title">Clinical Information</h2>
          <div className="content-wrapper">
            <div>
              <h3 className="subsection-title">Chief Complaint</h3>
              <p>_________________________________________________</p>
            </div>
            <div>
              <h3 className="subsection-title">History of Present Illness</h3>
              <div className="text-box"></div>
            </div>
          </div>
        </div>

        {/* Examination */}
        <div className="section">
          <h2 className="section-title">Physical Examination</h2>
          <div className="grid-2">
            <div>
              <h3 className="subsection-title">Vitals</h3>
              <p>BP: _______________</p>
              <p>Pulse: _____________</p>
              <p>Temp: _____________</p>
            </div>
            <div>
              <h3 className="subsection-title">General Appearance</h3>
              <div className="text-box"></div>
            </div>
          </div>
        </div>

        {/* Assessment & Plan */}
        <div className="section">
          <h2 className="section-title">Assessment & Plan</h2>
          <div className="content-wrapper">
            <div>
              <h3 className="subsection-title">Diagnosis</h3>
              <p>_________________________________________________</p>
            </div>
            <div>
              <h3 className="subsection-title">Treatment Plan</h3>
              <div className="text-box"></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="section footer">
          <div className="footer-content">
            <p>Signature: _________________</p>
            <p>Date: _________________</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalReport;