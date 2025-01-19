import React from "react";
import { useNavigate } from "react-router-dom";
import { restaurants, getStars } from "./Restaurant"; // Importing restaurant data and a utility for star ratings
import { useAuth } from "./AuthContext"; // Importing the authentication context to check login status

// Mock reviews data for demonstration purposes
export const reviews = [
  {
    id: 1,
    restaurantId: 1,
    food: 5.0,
    service: 5.0,
    interior: 5.0,
    cleanliness: 5.0,
    prices: 4.0,
  },
  {
    id: 2,
    restaurantId: 2,
    food: 5.0,
    service: 4.0,
    interior: 5.0,
    cleanliness: 3.0,
    prices: 4.0,
  },
];

// Button component for adding a review
const AddReviewButton = ({ restaurant }) => {
  const navigate = useNavigate(); // React Router's navigation hook
  const { isAuthenticated } = useAuth(); // Accessing authentication status

  // Handler for the button click
  const handleAddReview = () => {
    if (!restaurant) {
      console.error("Restaurant object is undefined!");
      return; // Prevent further execution if restaurant is undefined
    }

    // Redirect to login if not authenticated, else navigate to the review page
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/restaurants/${restaurant.id}/review` } });
    } else {
      navigate(`/restaurants/${restaurant.id}/review`);
    }
  };

  return (
    <button className="add-review" onClick={handleAddReview}>
      Add detailed review
    </button>
  );
};

// Main component for reviewing restaurants
export const ReviewRestaurant = () => {
  const navigate = useNavigate(); // Navigation hook

  // Filter reviews by restaurant ID
  const getReviewsByRestaurantId = (restaurantId) => {
    return reviews.filter((review) => review.restaurantId === restaurantId);
  };

  // Renders a rating bar with a label and its corresponding value
  const renderRatingBar = (label, rating) => (
    <div className="rating-bar-container">
      <div className="rating-bar-header">
        <span className="rating-label">{label.toUpperCase()}</span>
        <span className="rating-value">{rating.toFixed(1)}</span>
      </div>
      <div className="rating-bar">
        <div
          className="rating-bar-filled"
          style={{ width: `${(rating / 5) * 100}%` }} // Calculates bar width as a percentage of the maximum rating (5)
        ></div>
      </div>
    </div>
  );

  return (
    <div className="review-container">
      <h2>Discover Nigeria's Top 5 Restaurants—Chosen by You!</h2>
      <div className="review-highlight">
        <p>
          Got a favorite dining spot? Head to the Search Section, leave a review, and rate your favorite restaurant!
        </p>
        <button className="view-detail-btn" onClick={() => navigate("/search")}>
          Find your favorite restaurants and vote
        </button>
      </div>

      {/* Grid layout for displaying restaurants */}
      <div className="restaurant-grid">
        {restaurants.map((restaurant) => {
          // Get reviews specific to the current restaurant
          const restaurantReviews = getReviewsByRestaurantId(restaurant.id);

          return (
            <div key={restaurant.id} className="review-card">
              {/* Restaurant image */}
              <div
                className="review-image"
                style={{ backgroundImage: `url(${restaurant.image})` }}
              ></div>
              <div className="rating-category">
                {/* Restaurant details */}
                <h3>{restaurant.name}</h3>
                <p className="restaurant-cuisine">{restaurant.cuisine}</p>
                <p className="restaurant-address">{restaurant.address}</p>
                <p className="restaurant-rating">{getStars(restaurant.rating)}</p>

                {/* Display reviews if available, otherwise show a prompt */}
                {restaurantReviews.length > 0 ? (
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

                {/* Button to view detailed information about the restaurant */}
                <button
                  className="view-detail-btn"
                  onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                >
                  View Details
                </button>

                {/* Button to add a review */}
                <AddReviewButton restaurant={restaurant} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
