import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar";
import React from "react";
import './globals.css';

export default function Home() {
  return (
    <div className="p-4">
      <Navbar/>
      <HomePage />
    </div>
  );
}