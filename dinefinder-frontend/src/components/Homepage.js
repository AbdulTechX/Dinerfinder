// src/components/Homepage.js
import React, { useState } from 'react'; // Import React and useState for state management
import '../App.css'; // Import CSS for styling
import { Link, useNavigate } from 'react-router-dom'; // Import necessary hooks and components from react-router-dom
import { useAuth } from './AuthContext'; // Import custom authentication context
import { usePlacesWidget } from "react-google-autocomplete"; // Import Google Places autocomplete hook
import Select from 'react-select'; // Import react-select for multi-select dropdown
import { customStyles } from '../utils/styles'; // Import custom styles for react-select

// Define categories for cuisine types
const categories = [
    { value:'ALL', label: 'All' },
    { value: 'Casual Dining', label: 'Casual Dining'},
    { value: 'Café', label: 'Café'},
    { value: 'Fine Dining', label: 'Fine Dining'},
    { value: 'Local Dish', label: 'Local Dish'},
    { value: 'Italian Dish', label: 'Italian Dish'},
    { value: 'Chinese Dish', label: 'Chinese Dish'}
];

// Define budget categories
const budgetCategories = [
    {value:'low', label: 'Low (5000 - 15,000 Naira)' },
    {value:'Medium', label: 'Medium (15,000 - 50,000 Naira)' },
    {value: 'High', label: 'High (100,000 and above)' },
] 

// Navbar component for rendering the navigation bar
export const NavBar = () => {
    const { isAuthenticated, logout } = useAuth(); // Get auth status and logout function from AuthContext
    const navigate = useNavigate(); // Use navigate for redirection after logout

    // Handle logout
    const handleLogout = () => {
        logout(); // Call logout function
        navigate('/'); // Redirect to homepage after logout
    };

    return (
        <nav>
            <ul>
                {/* Logo and link to homepage */}
                <li><Link style={{fontWeight: 'bolder', fontSize: '30px'}} to="/">DineFinder</Link></li>
            </ul>
            <ul className='right'>    
                {/* Render different links based on whether the user is authenticated */}
                {isAuthenticated ? (
                    <>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><button onClick={handleLogout}>Sign Out</button></li>
                    </>
                ) : (
                    <>
                    <li><Link to="/login">Sign In</Link></li>
                    <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
       </nav>
    );
};

// Homepage component for rendering search form and welcome message
export const HomePage = ({onSearch}) => {
    // Set up the Google Places Autocomplete hook for location input
    const { ref: locationRef } =usePlacesWidget({
        apikey: "YOUR_GOOGLE_API_KEY", // Replace with your Google API key
        onPlaceSelected: (place) => console.log(place), // Callback to handle place selection
        options: {type: ["(cities)"] }, // Limit results to cities
    })

    // Use state hooks for selected categories and budgets
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBudget, setSelectedBudget] = useState([]);

    // Handle category selection change
    const handleCategoryChange = (selectedOptions) => {
        setSelectedCategories(selectedOptions || []); // Update state with selected categories
    };

    // Handle budget selection change
    const handleBudgetChange = (selectedOptions) => {
        setSelectedBudget(selectedOptions || []); // Update state with selected budget
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
    };

    return (
        <div className='body-page'>
            <h1 className='body-title'>Welcome to DineFinder!</h1>
            <p>Discover the best places to dine with us.</p>
            {/* Search form with multiple input fields */}
            <form className='search-form' onSubmit={handleSubmit}>
                <div className='search-container'>
                    {/* Name input field */}
                    <div className="location-container"> 
                        <i className='fa fa-search search-icon' ></i>
                        <input
                          type='text'
                          name='Name'
                          className='search-input'
                          placeholder='Name...'
                          required
                        />
                    </div>
                    {/* Location input field with Google Places Autocomplete */}
                    <div className="location-container">
                        <i className='fa fa-location-dot location-icon' ></i>
                        <input
                          ref={locationRef}
                          type='text'
                          name='Near'
                          styles={customStyles}
                          placeholder='Near...'
                          className="search-input"
                          required
                        />
                    </div>
                    {/* Cuisine category selection */}
                    <Select
                        options={categories}
                        isMulti
                        onChange={handleCategoryChange}
                        value={selectedCategories}
                        className="filter-select"
                        styles={customStyles}
                        placeholder="Select Cuisine"
                    />
                    {/* Budget category selection */}
                    <Select
                        options={budgetCategories}
                        isMulti
                        onChange={handleBudgetChange}
                        value={selectedBudget}
                        className='filter-select'
                        styles={customStyles}
                        placeholder="Select budget"
                    />
                    {/* Submit button */}
                    <button type='submit' className='search-button'>Search</button>
                </div>
            </form>
        </div>
    );
};

// Footer component for displaying footer links
export const Footer = () => {
    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} DineFinder. All rights reserved.</p>
            <ul className="footer-links">
                {/* Footer links for About Us, Contact, and Privacy Policy */}
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
        </footer>
    );
}
