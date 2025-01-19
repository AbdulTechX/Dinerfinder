import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider"; // Import slider components from react-compound-slider
import { restaurants } from "./Restaurant"; // Import the list of restaurants
import "../App.css"; // Import custom CSS for styling

// Inline styles for the slider and its components
const sliderStyle = {
  position: "relative",
  width: "100%",
  height: "10px",
  marginBottom: "15px",
};

const railStyle = {
  position: "absolute",
  width: "100%",
  height: 10,
  borderRadius: 7,
  backgroundColor: "#FFBF00", // Yellow background for the slider rail
};

const trackStyle = {
  position: "absolute",
  height: 15,
  borderRadius: 5,
  backgroundColor: "white", // White track to indicate selected range
};

const handleStyle = {
  position: "absolute",
  marginLeft: -2,
  marginTop: -2,
  width: 20,
  height: 20,
  borderRadius: "50%",
  backgroundColor: "#FFD700", // Gold color for the slider handle
  cursor: "pointer",
};

const tickStyle = {
  fontSize: 10,
  textAlign: "center",
  color: "white",
};

// Custom component to render the slider handle
const CustomHandle = ({ handle: { id, value, percent }, getHandleProps }) => (
  <div
    style={{
      ...handleStyle,
      left: `${percent}%`, // Position the handle based on slider value
    }}
    {...getHandleProps(id)}
  >
    {/* Display the slider value above the handle */}
    <div
      style={{
        position: "absolute",
        top: -10,
        left: -1,
        color: "white",
        background: "#FFBF00",
        fontSize: 5,
        textAlign: "center",
      }}
    >
      {value.toFixed(1)} {/* Display slider value */}
    </div>
  </div>
);

// Custom component to render the slider track
const CustomTrack = ({ source, target, getTrackProps }) => (
  <div
    style={{
      ...trackStyle,
      left: `${source.percent}%`, // Position start of the track
      width: `${target.percent - source.percent}%`, // Set the width of the track
    }}
    {...getTrackProps()}
  />
);

// Custom component to render slider ticks
const CustomTick = ({ tick: { value, percent } }) => (
  <div>
    <div
      style={{
        position: "absolute",
        left: `${percent}%`, // Position tick mark
        marginLeft: -5,
        width: 1,
        height: 8,
        backgroundColor: "#fff", // White tick mark
      }}
    />
    <div
      style={{
        ...tickStyle,
        position: "absolute",
        left: `${percent}%`, // Position tick label
        marginLeft: -5,
        width: 10,
        marginTop: 22,
      }}
    >
      {value === 0 ? "No rating" : value} {/* Display tick value */}
    </div>
  </div>
);

export const ReviewPage = () => {
  const { restaurantId } = useParams(); // Get restaurantId from URL
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [review, setReview] = useState({
    title: "", // Review title
    comment: "", // Review text
    food: 0, // Rating for food
    service: 0, // Rating for service
    interior: 0, // Rating for interior
    cleanliness: 0, // Rating for cleanliness
    prices: 0, // Rating for prices
  });

  const [restaurant, setRestaurant] = useState(null); // State to store the current restaurant details

  useEffect(() => {
    // Find the restaurant by ID when the component mounts
    const id = Number(restaurantId); // Convert restaurantId to a number
    const restaurantData = restaurants?.find((r) => r.id === id);
    if (restaurantData) {
      setRestaurant(restaurantData); // Set restaurant details
    }
  }, [restaurantId]);

  // Handle slider value change
  const handleSliderChange = (rating, value) => {
    setReview((prev) => ({
      ...prev,
      [rating]: value[0], // Update the rating in the review object
    }));
  };

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Extract name and value from event target
    setReview((prevReview) => ({
      ...prevReview,
      [name]: value, // Update the corresponding field in the review object
    }));
  };

  // Handle form submission
  const handleSubmitReview = (e) => {
    e.preventDefault(); // Prevent form reload
    console.log(`Review for restaurant ${restaurantId}:`, review); // Log the review for testing
    navigate(`/restaurants/${restaurantId}`); // Navigate back to the restaurant page
  };

  const domain = [0, 5]; // Slider range
  const step = 0.1; // Slider step size

  if (!restaurant) {
    // Display a message if the restaurant is not found
    return (
      <div className="review-details-page">
        <p>Restaurant not found! Please check the URL or data source.</p>
      </div>
    );
  }

  return (
    <div className="restaurant-details-page">
      <h2>{restaurant.name}</h2> {/* Display restaurant name */}
      <h3>Rate the Restaurant</h3>
      <form onSubmit={handleSubmitReview}>
        {/* Render a slider for each rating category */}
        {Object.keys(review).map((rating) =>
          rating !== "title" &&
          rating !== "comment" && ( // Exclude title and comment fields
            <div className="form-group" key={rating}>
              <label className="white-label">
                {rating.charAt(0).toUpperCase() + rating.slice(1)}: {/* Capitalize the rating name */}
              </label>
              <Slider
                rootStyle={sliderStyle}
                domain={domain}
                step={step}
                mode={1}
                values={[review[rating]]} // Bind slider value to state
                onUpdate={(value) => handleSliderChange(rating, value)} // Handle slider change
              >
                <Rail>
                  {({ getRailProps }) => (
                    <div style={railStyle} {...getRailProps()} />
                  )}
                </Rail>
                <Handles>
                  {({ handles, getHandleProps }) => (
                    <div>
                      {handles.map((handle) => (
                        <CustomHandle
                          key={handle.id}
                          handle={handle}
                          getHandleProps={getHandleProps}
                        />
                      ))}
                    </div>
                  )}
                </Handles>
                <Tracks>
                  {({ tracks, getTrackProps }) => (
                    <div>
                      {tracks.map(({ id, source, target }) => (
                        <CustomTrack
                          key={id}
                          source={source}
                          target={target}
                          getTrackProps={getTrackProps}
                        />
                      ))}
                    </div>
                  )}
                </Tracks>
                <Ticks count={6}>
                  {({ ticks }) => (
                    <div>
                      {ticks.map((tick) => (
                        <CustomTick key={tick.id} tick={tick} />
                      ))}
                    </div>
                  )}
                </Ticks>
              </Slider>
            </div>
          )
        )}
        <div className="form-group">
          <label className="white-label">Review Title</label>
          <input
            type="text"
            name="title"
            value={review.title} // Bind title input to state
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label className="white-label">Review</label>
          <textarea
            name="comment"
            value={review.comment} // Bind comment input to state
            onChange={handleInputChange}
          />
        </div>
        <button className="click" type="submit">
          Submit {/* Submit review */}
        </button>
      </form>
    </div>
  );
};
