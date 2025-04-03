/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
"use client"
import { useState, useEffect } from "react"
import { VolunteerCard } from "./volunteerCard"
import { VolunteerDetails } from "./volunteerDetails"
import dummyVolunteers from '../../data/vol.json'
import axios from "axios"
// Dummy volunteer data

function Vol() {
  const [volunteers, setVolunteers] = useState([])
  const [selectedVolunteer, setSelectedVolunteer] = useState(null)
  const [filters, setFilters] = useState({
    skills: "",
    location: "",
    locationType: "",
    availability: "",
  })

  useEffect(() => {
    // Set volunteers data

    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/recommend_volunteers?school_id=1");
        console.log(response.data.recommended_volunteers);
        setVolunteers(response.data.recommended_volunteers);
        if (response.data.recommended_volunteers && response.data.recommended_volunteers.length > 0) {
          setSelectedVolunteer(response.data.recommended_volunteers[0]);
        // } else {
        //   setVolunteers(dummyVolunteers);
        //   setSelectedVolunteer(dummyVolunteers[0]);
        }
      } catch (error) {
        console.error("Error fetching volunteers:", error);
        setVolunteers(dummyVolunteers);
        setSelectedVolunteer(dummyVolunteers[0]);
      }
    };

    fetchData();

    // console.log(realData)
    // setVolunteers(dummyVolunteers)
    // setSelectedVolunteer(dummyVolunteers[0])
  }, [])

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }))
  }

  const filteredVolunteers = volunteers.filter((volunteer) => {
    // Filter by skills
    if (filters.skills && filters.skills.trim() !== "") {
      if (!volunteer.skills || !Array.isArray(volunteer.skills)) {
        return false;
      }
      if (!volunteer.skills.some((skill) => 
        skill && typeof skill === 'string' && 
        skill.toLowerCase().includes(filters.skills.toLowerCase())
      )) {
        return false;
      }
    }
  
    // Filter by location
    if (filters.location && filters.location.trim() !== "") {
      if (!volunteer.locations) {
        return false;
      }
      
      if (Array.isArray(volunteer.locations)) {
        const hasMatchingLocation = volunteer.locations.some(location => 
          location && typeof location === 'string' && 
          location.toLowerCase().includes(filters.location.toLowerCase())
        );
        if (!hasMatchingLocation) return false;
      } else if (typeof volunteer.locations === 'string') {
        if (!volunteer.locations.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      } else {
        return false;
      }
    }
  
    // Filter by location type
    if (filters.locationType && filters.locationType !== "") {
      if (!volunteer.location_type_preference || 
          volunteer.location_type_preference !== filters.locationType) {
        return false;
      }
    }
  
    // Filter by availability
    if (filters.availability && filters.availability !== "") {
      if (filters.availability === "available" && volunteer.available !== "yes") {
        return false;
      }
      if (filters.availability === "limited" && volunteer.available !== "limited") {
        return false;
      }
    }
  
    return true;
  });
  

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Volunteer Management</h1>
          <p className="text-gray-600">Find and book volunteers for your organization</p>
        </header>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Volunteer List */}
          <div className="w-full md:w-80 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-700">Filters</h2>
              </div>

              <div className="space-y-3">
                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                    Skills
                  </label>
                  <input
                    type="text"
                    id="skills"
                    value={filters.skills}
                    onChange={(e) => handleFilterChange("skills", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search skills..."
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={filters.location}
                    onChange={(e) => handleFilterChange("location", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search location..."
                  />
                </div>

                <div>
                  <label htmlFor="locationType" className="block text-sm font-medium text-gray-700 mb-1">
                    Location Type
                  </label>
                  <select
                    id="locationType"
                    value={filters.locationType}
                    onChange={(e) => handleFilterChange("locationType", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                    Availability
                  </label>
                  <select
                    id="availability"
                    value={filters.availability}
                    onChange={(e) => handleFilterChange("availability", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All</option>
                    <option value="available">Available</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <h2 className="p-4 font-semibold text-gray-700 border-b">Volunteers ({filteredVolunteers.length})</h2>

              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {filteredVolunteers.map((volunteer) => (
                  <div key={volunteer.volunteer_id} className="p-3">
                    <VolunteerCard
                      volunteer={volunteer}
                      isSelected={selectedVolunteer?.volunteer_id === volunteer.volunteer_id}
                      onClick={() => setSelectedVolunteer(volunteer)}
                    />
                  </div>
                ))}

                {filteredVolunteers.length === 0 && (
                  <div className="p-4 text-center text-gray-500">No volunteers match your filters</div>
                )}
              </div>
            </div>
          </div>

          {/* Volunteer Details */}
          <div className="flex-1">
            {selectedVolunteer ? (
              <VolunteerDetails volunteer={selectedVolunteer} />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500">Select a volunteer to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Vol;

