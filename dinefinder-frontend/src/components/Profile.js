import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '../utils/api'; // Import API functions
import { useAuth } from './AuthContext';

const Profile = () => {
    const { isAuthenticated } = useAuth(); // Assuming `useAuth` gives authentication state
    const [formData, setFormData] = useState({ username: '', email: '' });
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        // Only fetch the profile if authenticated
        const fetchProfile = async () => {
            setLoading(true); // Start loading before fetching data
            try {
                const { data } = await getUserProfile(); // API call to get profile
                console.log('Fetched profile data:', data);
                if (data) {
                    setFormData({
                        username: data.username || '', // pre-fill username from server
                        email: data.email || '', // pre-fill email from server (read-only)
                    });
                    setMessage(null); // Reset error message if profile fetch is successful
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                setMessage({
                    type: 'error',
                    text: 'Failed to load profile data.',
                });
            } finally {
                setLoading(false); // Stop loading after API call completes
            }
        };

        if (isAuthenticated) {
            fetchProfile(); // Fetch profile data if authenticated
        }
    }, [isAuthenticated]); // Dependency array ensures it re-runs when authentication changes

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Only send the username to update, email should remain unchanged
            await updateUserProfile(formData); // API call to update user profile
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Failed to update profile.',
            });
        }
    };

    return (
        <div className="profile">
            <div className="profile-logo-container">
                <div className="profile-logo">
                    <img
                        src="/images/logo.PNG"
                        alt="Profile Logo"
                    />
                </div>
            </div>

            <div className="profile-page">
                <h2>Profile</h2>
                <p>Make changes to your account here</p>

                {message && (
                    <p className={message.type === 'success' ? 'success' : 'error'}>
                        {message.text}
                    </p>
                )}

                {/* Show loading indicator while fetching */}
                {loading ? (
                    <p>Loading your profile...</p>
                ) : (
                    // Profile Update Form
                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-group">
                            <label htmlFor="username">Name</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                readOnly // Email is read-only as per the requirement
                            />
                        </div>
                        <button type="submit">Update Profile</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;
