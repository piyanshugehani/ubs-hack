import React from 'react';
import Leaderboard from './Leaderboard';

const dummyData = [
  {
    name: "David Kim",
    rating: 4.7,
    hoursPerWeek: 15,
    retention: 90,
    gamificationPoints: 290,
  },
  {
    name: "Alice Johnson",
    rating: 4.9,
    hoursPerWeek: 20,
    retention: 95,
    gamificationPoints: 320,
  },
  {
    name: "John Doe",
    rating: 4.5,
    hoursPerWeek: 10,
    retention: 85,
    gamificationPoints: 250,
  },
  {
    name: "Emily Davis",
    rating: 4.8,
    hoursPerWeek: 18,
    retention: 92,
    gamificationPoints: 310,
  },
];


// Formula to calculate total contribution
const calculateContribution = (volunteer) => {
  return (
    volunteer.rating * 10 +
    volunteer.hoursPerWeek * 5 +
    volunteer.retention * 2 +
    volunteer.gamificationPoints
  );
};


// More professional version with SVG-like badge

const Progress = () => {
  const contributionData = dummyData.map((volunteer) => ({
    ...volunteer,
    contribution: Math.round(calculateContribution(volunteer)),
  }));

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="row d-flex justify-content-center gap-4">
      {/* Achievement: Download Notes */}
      <div className="col-md-4 col-lg-3">
        <div className="card text-center">
          <div className="card-body">
            {/* Shared Image */}
            <img
              src="assets/img/logo.png"
              alt="Badge"
              className="img-fluid mb-3"
            />
            <span className="badge bg-primary fs-6">Notes Master</span>
            <p className="mt-2 text-muted">Downloaded 50+ Notes</p>
          </div>
        </div>
      </div>

      {/* Achievement: Video Lectures */}
      <div className="col-md-4 col-lg-3">
        <div className="card text-center">
          <div className="card-body">
            {/* Shared Image */}
            <img
              src="assets/img/logo.png"
              alt="Badge"
              className="img-fluid mb-3"
            />
            <span className="badge bg-success fs-6">Video Guru</span>
            <p className="mt-2 text-muted">Uploaded 100+ Lectures</p>
          </div>
        </div>
      </div>

      {/* Achievement: Quiz Champion */}
      <div className="col-md-4 col-lg-3">
        <div className="card text-center">
          <div className="card-body">
            {/* Shared Image */}
            <img
              src="assets/img/logo.png"
              alt="Badge"
              className="img-fluid mb-3"
            />
            <span className="badge bg-warning fs-6 text-dark">Streak Champion</span>
            <p className="mt-2 text-muted">100 consecutive days login</p>
          </div>
        </div>
      </div>
      
    </div>

      <div className="max-w-6xl mx-auto py-8 px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Volunteer Recognition</h1>
          <p className="text-gray-600">
            Celebrating our outstanding volunteers and their contributions
          </p>
        </header>
        
        {/* Professional Badge Section */}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Leaderboard title="Top Rated Volunteers" data={dummyData} sortKey="rating" unit="stars" />
          <Leaderboard title="Most Dedicated" data={dummyData} sortKey="hoursPerWeek" unit="hrs" />
          <Leaderboard title="Best Student Retention" data={dummyData} sortKey="retention" unit="%" />
          <Leaderboard title="Total Impact Score" data={contributionData} sortKey="contribution" unit="pts" />
        </div>
        
        <footer className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>Updated weekly. Last update: April 4, 2025</p>
        </footer>
      </div>
    </div>
  );
};

export default Progress;