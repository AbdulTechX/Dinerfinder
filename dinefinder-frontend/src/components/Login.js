import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../utils/api"; // Assuming loginUser is defined properly
import { useAuth } from "./AuthContext"; // Import the AuthContext for handling authentication
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

export const Login= () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/"; // Default to homepage if no state

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const { login } = useAuth(); // Use login from AuthContext to manage user login
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility

  const handleLogin = async (e) => {
    e.preventDefault();

    // Reset errors
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    let hasError = false;

    // Basic validation
    if (!email) {
      setEmailError("Please enter a valid email address.");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password must be at least 6 characters.");
      hasError = true;
    }

    if (hasError) return;

    try {
      // Attempt to log the user in
      const { data } = await loginUser({ email, password });

      // Use the login function from the AuthContext to store the token
      login(data.token);
      alert("Login successful!");
      navigate(from); // Redirect to the page the user came from (e.g., review page)

    } catch (err) {
      // Handle errors such as invalid credentials
      setGeneralError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Sign In</h2>
        <p>Enter your credentials to access your account</p>
        {generalError && <p style={{ color: "red", marginTop: "10px" }}>{generalError}</p>}

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="your-email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p style={{ color: "red" }}>{emailError}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-container">
            <input
              id="password"
              type={passwordVisible ? "text" : "password"} // Toggle password visibility
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />} {/* Eye icons */}
            </button>
          </div>
          {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
        </div>

        <button className="click" type="submit">Sign in</button>

        <div className="signup-prompt">
          <p>Don't have an account? <a href="/register">Sign Up</a></p>
        </div>
      </form>
    </div>
  );
};

export default Login;
