/* eslint-disable react/prop-types */
import { useState } from "react"
import { Calendar } from "./Calendar"

export function VolunteerDetails({ volunteer }) {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setSelectedTime(null)
    setBookingSuccess(false)
  }

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
    setBookingSuccess(false)
  }

  const handleBooking = () => {
    // In a real app, this would send a booking request to the server
    setBookingSuccess(true)
  }

  const availableTimes = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"]

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
        <div className="flex items-center">
          <div className="h-15 w-15 rounded-full overflow-hidden border-4 border-white">
            <img
              src={volunteer.avatar || "https://via.placeholder.com/80"}
              alt={volunteer.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="ml-6">
            <h1 className="text-2xl font-bold text-white">{volunteer.name}</h1>
            <div className="flex items-center mt-1">
              <span className="ml-2 capitalize">
                {volunteer.available === "yes"
                  ? "Available"
                  : volunteer.available === "limited"
                    ? "Limited Availability"
                    : "Not Available"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === "profile"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("booking")}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === "booking"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Book a Session
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Volunteer Info */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Volunteer Information</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1">{volunteer.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="mt-1">{volunteer.phone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p className="mt-1">{volunteer.locations}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Preference</h3>
                  <p className="mt-1 capitalize">{volunteer.location_type_preference}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Max Hours per Week</h3>
                  <p className="mt-1">{volunteer.max_hours_per_week} hours</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Skills</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {volunteer.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Languages</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {volunteer.languages.map((language, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Hours Taught</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{volunteer.hours_taught}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Rating</h3>
                  <div className="mt-1 flex items-center">
                    <p className="text-2xl font-semibold text-gray-900">{volunteer.rating}</p>
                    <div className="ml-2 flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(volunteer.rating) ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Student Retention</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{volunteer.student_retention}%</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Gamification Points</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{volunteer.gamification_points}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Stats and Additional Info */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Performance</h2>
                <div className="space-y-4">
                  <div className="relative pt-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-blue-600">Student Satisfaction</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-blue-600">
                          {Math.round(volunteer.rating * 20)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                      <div
                        style={{ width: `${Math.round(volunteer.rating * 20)}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      ></div>
                    </div>
                  </div>

                  <div className="relative pt-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-green-600">Student Retention</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-green-600">
                          {volunteer.student_retention}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                      <div
                        style={{ width: `${volunteer.student_retention}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                      ></div>
                    </div>
                  </div>

                  <div className="relative pt-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-purple-600">Engagement Score</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-purple-600">
                          {Math.min(100, Math.round(volunteer.gamification_points / 50))}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                      <div
                        style={{ width: `${Math.min(100, Math.round(volunteer.gamification_points / 50))}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Availability Overview</h2>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        volunteer.available === "yes"
                          ? "bg-green-100 text-green-800"
                          : volunteer.available === "limited"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {volunteer.available === "yes"
                        ? "Available"
                        : volunteer.available === "limited"
                          ? "Limited Availability"
                          : "Not Available"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Max Hours/Week:</span>
                    <span className="text-sm font-medium">{volunteer.max_hours_per_week} hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Preference:</span>
                    <span className="text-sm font-medium capitalize">{volunteer.location_type_preference}</span>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm text-gray-600">Unavailable Dates:</span>
                    {/* <div className="mt-2 flex flex-wrap gap-2">
                      {volunteer.dateArray.map((date, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                        >
                          {date}
                        </span>
                      ))}
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        
      </div>
    </div>
  )
}
