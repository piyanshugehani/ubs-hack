import React, { useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import axios from "axios";

const Feedback = () => {
  const [rating, setRating] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleRating = (value) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (rating !== null && feedback.trim() !== "") {
      setSubmitted(true);
    }

      const feedbackData = {
        rating,
        feedback,
      };

      // Send feedback to the server
      try{
      axios
        .post("http://localhost:5000/student/feedback", feedbackData)
        .then((response) => {
          console.log("Feedback submitted successfully:", response.data);
          setSubmitted(true);
        })
        .catch((error) => {
          console.error("Error submitting feedback:", error);
        });
    }catch (error) {
      console.error("Error submitting feedback:", error);
    }
    finally {
      setSubmitted(true);
      navigate("/student/quiz");
    }


  };

  return (
    <div className="flex flex-col items-center mt-10 bg-gray-100 h-screen">
      {!submitted ? (
        <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[450px]">
          <h2 className="text-2xl font-semibold mb-4">Rate the Lecture</h2>

          {/* Centered stars */}
          <div className="flex justify-center gap-3 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-4xl cursor-pointer ${
                  rating !== null && star <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => handleRating(star)}
              >
                {star <= rating ? "★" : "☆"}
              </span>
            ))}
          </div>

          {/* Feedback Text Field */}
          <textarea
            className="w-full p-3 border rounded-lg mb-4 resize-none text-lg"
            rows="5"
            placeholder="Write your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>

          {/* Submit Button */}
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[450px]">
          <h2 className="text-2xl font-semibold mb-4">Thank you for your feedback!</h2>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => navigate("/student")}
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default Feedback;
