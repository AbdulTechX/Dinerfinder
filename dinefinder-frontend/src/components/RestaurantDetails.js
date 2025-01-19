import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper components for image carousel
import "swiper/css"; // Swiper core styles
import "swiper/css/pagination"; // Swiper pagination styles
import { Pagination } from "swiper/modules"; // Import Swiper pagination module
import { useParams, useNavigate } from "react-router-dom"; // Import React Router hooks
import React from "react";
import { getStars, restaurants } from "./Restaurant"; // Import helper functions and restaurant data
import "../App.css"; // Global styles
import { reviews } from "./Review"; // Import reviews mock data
import { useAuth } from './AuthContext'; // Import custom hook for authentication

// Mock data for restaurant opening hours
const openingHours = {
  Monday: "12:00 pm - 4:30 pm, 7:30 pm - 12:00 am",
  Tuesday: "12:00 pm - 4:30 pm, 7:30 pm - 12:00 am",
  Wednesday: "12:00 pm - 4:30 pm, 7:30 pm - 12:00 am",
  Thursday: "12:00 pm - 4:30 pm, 7:30 pm - 12:00 am",
  Friday: "12:00 pm - 4:30 pm, 7:30 pm - 1:00 am",
  Saturday: "12:00 pm - 4:30 pm, 7:30 pm - 1:00 am",
  Sunday: "12:00 pm - 4:30 pm, 7:30 pm - 12:00 am",
};

// Component to display opening hours
const OpeningHours = ({ hours }) => (
  <div className="opening-hours">
    <h2>Opening Hours</h2>
    <ul>
      {Object.entries(hours).map(([day, time]) => (
        <li key={day}>
          <strong>{day}</strong>{time}
        </li>
      ))}
    </ul>
  </div>
);

// Utility function to render a rating bar
const renderRatingBar = (label, rating) => (
  <div className="rating-bar-container">
    <div className="rating-bar-header">
      <span className="rating-label">{label.toUpperCase()}</span>
      <span className="rating-value">{rating.toFixed(1)}</span>
    </div>
    <div className="rating-bar">
      <div
        className="rating-bar-filled"
        style={{ width: `${(rating / 5) * 100}%` }} // Calculate width based on rating
      ></div>
    </div>
  </div>
);

// Function to fetch reviews for a specific restaurant by its ID
const getReviewsByRestaurantId = (restaurantId) => {
  return reviews.filter((review) => review.restaurantId === restaurantId);
};

// Button component to add a detailed review
const AddReviewButton = ({ restaurant }) => {
  const navigate = useNavigate(); // Hook to navigate between routes
  const { isAuthenticated } = useAuth(); // Check if the user is authenticated

  const handleAddReview = () => {
    if (!restaurant) {
      console.error("Restaurant object is undefined!");
      return; // Prevent navigation if restaurant is not defined
    }

    if (!isAuthenticated) {
      // Redirect to login if user is not authenticated
      navigate("/login", { state: { from: `/restaurants/${restaurant.id}/review` } });
    } else {
      // Navigate to add review page if authenticated
      navigate(`/restaurants/${restaurant.id}/review`);
    }
  };

  return (
    <button className="add-details-review" onClick={handleAddReview}>
      Add detailed review
    </button>
  );
};

// Main component to display restaurant details
export const RestaurantDetails = () => {
  const { id } = useParams(); // Extract restaurant ID from URL params
  const restaurant = restaurants.find((r) => r.id === parseInt(id)); // Find restaurant by ID

  if (!restaurant) return <p>Restaurant not found!</p>; // Handle case when restaurant is not found

  const restaurantReviews = getReviewsByRestaurantId(restaurant.id); // Get reviews for the restaurant

  return (
    <div className="restaurant-details-page">
      {/* Restaurant Name and Rating */}
      <h1>{restaurant.name}</h1>
      <p>
        {restaurant.name} / Restaurant / Rating {getStars(restaurant.rating)} (
        {restaurant.rating})
      </p>
      <p className="restaurant-address">{restaurant.address}</p>

      {/* Header Section */}
      <div className="header-section">
        <div className="header-body">
          {/* Swiper for displaying restaurant images */}
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }} // Enable clickable dots
            loop={true} // Enable infinite loop
            className="restaurant-images-swiper"
          >
            {restaurant.images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`Restaurant view ${index + 1}`}
                  className="details-page-image"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <i className="fa fa-utensils cuisine-icon"> cuisine </i>
          <p className="restaurant-cuisine">{restaurant.cuisine}</p>
          <p className="restaurant-phone">{restaurant.phone}</p>
        </div>

        {/* Reviews Section */}
        <div className="details-review-page">
          <div className="rating-category">
            <h3>Detailed Review Ratings</h3>
            {restaurantReviews.length > 0 ? (
              // Render detailed ratings for each review
              restaurantReviews.map((review) => (
                <div key={review.id} className="rating-bars">
                  {renderRatingBar("Food", review.food)}
                  {renderRatingBar("Service", review.service)}
                  {renderRatingBar("Interior", review.interior)}
                  {renderRatingBar("Cleanliness", review.cleanliness)}
                  {renderRatingBar("Prices", review.prices)}
                </div>
              ))
            ) : (
              <p>No reviews yet. Be the first to review!</p>
            )}
            <AddReviewButton restaurant={restaurant} /> {/* Button to add a review */}
          </div>

          {/* Opening Hours Section */}
          <OpeningHours hours={openingHours} />
        </div>
      </div>
    </div>
  );
};
