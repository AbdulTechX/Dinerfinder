import React, { useState } from 'react';
import { registerUser } from '../utils/api'; // Import API utility for user registration
import { useNavigate } from 'react-router-dom'; // Hook for navigation
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Icons for password visibility toggle
import '../App.css'; // Import global styles

const Register = () => {
    // State to store form inputs
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });

    // State for form error messages
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, SetGeneralError] = useState('');

    // State for registration success message
    const [success, setSuccess] = useState(null);

    // State to show loading indicator
    const [loading, setLoading] = useState(false);

    // State to toggle password visibility
    const [passwordVisible, setPasswordVisible] = useState(false);

    const navigate = useNavigate(); // Navigate between routes

    // Function to handle successful registration
    const handleRegistrationSuccess = (token) => {
        localStorage.setItem('token', token); // Store token in local storage
    };

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload on form submission

        // Reset all error messages
        setUsernameError('');
        setEmailError('');
        setPasswordError('');
        SetGeneralError('');

        let hasError = false; // Flag to track validation errors

        // Validate username
        if (!formData.username || formData.username.length < 2) {
            setUsernameError('Name must be at least 2 characters.');
            hasError = true;
        }

        // Validate email using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setEmailError('Please enter a valid email address.');
            hasError = true;
        }

        // Validate password (at least 6 characters, including letters and numbers)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (!formData.password || !passwordRegex.test(formData.password)) {
            setPasswordError('Password must be at least 6 characters and include both letters and numbers.');
            hasError = true;
        }

        if (hasError) return; // Stop execution if validation fails

        setLoading(true); // Show loading indicator during API call

        try {
            const response = await registerUser(formData); // Call API to register user
            const { token } = response.data; // Extract token from API response
            handleRegistrationSuccess(token); // Handle successful registration
            setSuccess('Registration successful!'); // Show success message
            SetGeneralError(null); // Clear general error

            // Redirect to the profile page after a brief delay
            setTimeout(() => navigate('/profile'), 1000);
        } catch (err) {
            // Show error message from API response or a default message
            SetGeneralError(err.response?.data?.message || 'Registration failed.');
            setSuccess(null); // Clear success message
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    return (
        <form onSubmit={handleSubmit} className='register-form'>
            {/* Form Header */}
            <h2>Sign UP</h2>
            <p>Create your account to get started</p>

            {/* Success or Error Messages */}
            {success && <p className='success'>{success}</p>}
            {generalError && <p className="error">{generalError}</p>}

            {/* Name Input Field */}
            <div className="form-group">
                <label htmlFor="Name">Name</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Your name"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                {usernameError && <p className="error">{usernameError}</p>}
            </div>

            {/* Email Input Field */}
            <div className="form-group">
                <label htmlFor="Email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {emailError && <p className="error">{emailError}</p>}
            </div>

            {/* Password Input Field with Visibility Toggle */}
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-container">
                    <input
                        type={passwordVisible ? "text" : "password"} // Toggle password visibility
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility
                    >
                        {passwordVisible ? <FaEyeSlash /> : <FaEye />} {/* Show appropriate icon */}
                    </button>
                </div>
                {passwordError && <p className="error">{passwordError}</p>}
            </div>

            {/* Submit Button */}
            <button className="click" type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register'} {/* Show loading state */}
            </button>

            {/* Sign In Prompt */}
            <div className="signup-prompt">
                <p> Already have an account? <a href="/login">Sign In</a></p>
            </div>
        </form>
    );
};

export default Register;
