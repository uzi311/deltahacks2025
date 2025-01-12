"use client"
import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import TextField from '@mui/material/TextField';
import './MedicalReport.css';
import Button from '@mui/material/Button';

// Register chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

export default function LandingPage() {
  const [message, setMessage] = useState("Enter Question for Patient");
  const [analysisResult, setAnalysisResult] = useState(null);
  const shownResponse = analysisResult ? analysisResult : 'Waiting for analysis...'

  const handleMessageChange = (e) => {
    if (e.target.value == '') {
      setMessage("Enter Question for Patient");
    } else {
      setMessage(e.target.value);
    }
  };

  const data = {
    labels: ["Anger", "Sadness", "Anxiety", "Joy", "Embarrassment", "Calmness"],
    datasets: [
      {
        data: [60, 30, 10, 0, 0, 0], // Simulated data, can be dynamic
        backgroundColor: ["#FF0000", "#C70039", "#2196F3", "#FFFF00", "#FFC0CB", "#3CB371"], // Colors for each section
      },
    ],
  };

  useEffect(() => {
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
    }, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container">
        <div className="left-section">
          <Doughnut data={data} width={400} height={400} />
        </div>

        <div className="right-section">
          <div className="bubble-container">
            <div className="text-bubble">
              <TextField id="outlined-basic" label={message} variant="outlined" sx={{width: "100%"}} onChange={handleMessageChange}/>
            </div>

            <div className="response-bubble">
              <TextField
              id="outlined-read-only-input"
              label="Read Only"
              defaultValue={shownResponse}
              sx={{width: "100%", height:"100%"}}
              multiline
              rows={16}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              />
            </div>
            <Button variant="contained" className='submit-button' sx={{backgroundColor: "#008080", height: "40px"}}>Submit</Button>
          </div>
        </div>
    </div>
  );
}
