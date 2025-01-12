// login.js
"use client"
import React, { useState } from "react";
import { useRouter } from 'next/navigation';

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // Add authentication logic here
    if (username == "admin" && password == "admin") {
        router.push('./dash')
    } 
  };

  return (
    <div className="login-container">
      <div className = "password-header">
        <h1>Login</h1>
      </div>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label className = "username" htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="form-group">
          <label className = "username" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="login-button">Sign In</button>
      </form>
    </div>
  );
}

export default LoginPage;