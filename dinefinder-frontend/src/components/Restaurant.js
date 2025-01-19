import React from "react";
import '../App.css'; // Import global styles
import { useNavigate } from "react-router-dom"; // Import React Router hook for navigation

// Helper function to generate stars based on rating
export const getStars = (rating) => {
    const fullStars = Math.floor(rating); // Number of full stars
    const halfStar = rating % 1 >= 0.5 ? 1 : 0; // Check if there's a half-star
    const emptyStars = 5 - fullStars - halfStar; // Remaining empty stars to complete 5

    return (
        <>
            {/* Render full stars */}
            {"★".repeat(fullStars).split("").map((star, index) => (
                <span key={index} style={{ color: "gold" }}>{star}</span>
            ))}
            {/* Render half star if applicable */}
            {halfStar === 1 && (
                <span style={{ color: "gold" }}>☆</span>
            )}
            {/* Render empty stars */}
            {"☆".repeat(emptyStars).split("").map((star, index) => (
                <span key={index} style={{ color: "lightgray" }}>{star}</span>
            ))}
        </>
    );
};

// Mock data for featured restaurants
export const restaurants = [
    {
        id: 1,
        cuisine: "Fine Dining", // Type of cuisine
        name: "The Place", // Restaurant name
        rating: 4.5, // Overall rating
        image: "/images/ThePlace.jpg", // Thumbnail image
        images: ["/images/ThePlace.jpg", "/images/ThePlace2.jpg", "/images/ThePlace1.jpg"], // Additional images
        address: "123 Main Street, Lagos", // Location
        description: "A cozy spot offering delicious fast-casual meals.", // Description of the restaurant
        phone: "", // Contact number (empty for now)
    },
    {
        id: 2,
        name: "Tastia",
        cuisine: "Casual Dining",
        rating: 4.7,
        image: "/images/Tastia.jpeg",
        images: ["/images/Tastia.jpg", "/images/Tastia1.jpg", "/images/Tastia2.jpg"],
        address: "456 Victoria Island, Lagos",
        description: "Perfect for casual dining with an extensive menu.",
        phone: "",
    },
    {
        id: 3,
        name: "Jazzy Burger",
        cuisine: "Cafés",
        rating: 5,
        address: "11B Isaac John Street, G.R.A, Ikeja Lagos, Nigeria.",
        description: "Home of the juiciest burgers and a vibrant atmosphere.",
        image: "/images/Jazzy.jpg",
        images: ["/images/Jazzy1.jpg", "/images/JazzyBurger2.jpg", "/images/JazzyBurger.jpg"],
        phone: "09074666655",
    },
    {
        id: 4,
        name: "Spicy Village",
        cuisine: "Local dish",
        address: "456 Curry Lane, Abuja",
        description: "Authentic Indian spices and flavors.",
        rating: 4.0,
        image: "/images/SpicyVillage.jpg",
        images: ["/images/SpicyVillage2.jpg", "/images/SpicyVillage1.jpg", "/images/SpicyVillage3.jpg"],
        phone: "",
    },
];

// Component to display featured restaurants
export const FeaturedRestaurants = () => {
    const navigate = useNavigate(); // Hook to programmatically navigate between routes

    return (
        <div className="featured-container">
            {/* About Section */}
            <div className="blog-about">
                <h1>Looking for your next dining adventure?</h1>
                <p>
                    DineFinder is your trusted companion for discovering incredible meals and unforgettable restaurant experiences. 
                    Our mission is to simplify your search for the best dining spots, no matter where you are in Nigeria. 
                    With DineFinder, you can effortlessly explore restaurants in all major cities. Filter your search by location, 
                    cuisine, price range, or ratings to find exactly what you're craving. 
                </p>
                <p>
                    Whether it's a cozy café, a fine-dining venue, or a hidden gem serving gluten-free or vegan options, we've got you covered. 
                    Use our smart "Top Picks Near You" feature to discover the best-rated restaurants close to your current location. Dive into 
                    interactive maps to explore nearby options and check out detailed restaurant profiles complete with reviews, photos, and personalized recommendations.
                </p>
                <p>So why wait? Start your journey to amazing dining experiences today with DineFinder—where great food is just a click away!</p>
            </div>

            {/* Section Title */}
            <h2>Featured Restaurants</h2>

            {/* Restaurant Grid */}
            <div className="restaurant-grid">
                {restaurants.map((restaurant, index) => (
                    <div key={restaurant.id} className="restaurant-card">
                        {/* Restaurant Image */}
                        <div
                          className="restaurant-image"
                          style={{ backgroundImage: `url(${restaurant.image})` }} // Background image styling
                        ></div>
                        <div className="restaurant-card-content">
                            {/* Restaurant Details */}
                            <h4>{restaurant.name}</h4>
                            <p className="restaurant-cuisine">{restaurant.cuisine}</p>
                            <p className="restaurant-address">{restaurant.address}</p>
                            <p className="restaurant-rating">
                                Rating: {getStars(restaurant.rating)} {/* Display stars */}
                            </p>
                            {/* Button to navigate to restaurant details page */}
                            <button
                                className="view-detail-btn"
                                onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
