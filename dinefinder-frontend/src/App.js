// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import { HomePage, NavBar, Footer } from './components/Homepage';
import { AuthProvider } from './components/AuthContext';
import  { FeaturedRestaurants } from './components/Restaurant'; 
import { ReviewRestaurant } from './components/Review';
import {RestaurantDetails} from './components/RestaurantDetails'
import { ReviewPage } from './components/ReviewPage';



const App = () => {
    return (
        <AuthProvider>
        <Router>
            <div className='full-page-container'>
                {/* Navbar is placed outside of the Routes, so it will always be visible */}
                <NavBar /> 
            
                <Routes>
                    {/* Main Layout */}
                    <Route path="/" element={<> 
                    <HomePage /> 
                    <FeaturedRestaurants />
                    <ReviewRestaurant/></>} />
                    <Route path="/restaurants/:id" element={ <div className="restaurant-details-background"><RestaurantDetails /></div>}/>
                    <Route path="/restaurants/:restaurantId/review" element={ <div className="restaurant-details-background"><ReviewPage /></div>} 
                    />
                    
                    {/* Auth Layout */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
                <Footer />
            </div>   
        </Router>
        </AuthProvider>
    );
};

export default App;
