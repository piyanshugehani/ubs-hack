"use client"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowUp, ArrowDown, Award, Clock, Users, Star, Trophy, ChevronRight } from "lucide-react"


const dummyData = [
  {
    name: "David Kim",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4.7,
    hoursPerWeek: 15,
    retention: 90,
    gamificationPoints: 290,
    streak: 45,
    previousRank: 2,
  },
  {
    name: "Alice Johnson",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4.9,
    hoursPerWeek: 20,
    retention: 95,
    gamificationPoints: 320,
    streak: 78,
    previousRank: 1,
  },
  {
    name: "John Doe",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4.5,
    hoursPerWeek: 10,
    retention: 85,
    gamificationPoints: 250,
    streak: 23,
    previousRank: 4,
  },
  {
    name: "Emily Davis",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4.8,
    hoursPerWeek: 18,
    retention: 92,
    gamificationPoints: 310,
    streak: 56,
    previousRank: 3,
  },
]


// Formula to calculate total contribution
const calculateContribution = (volunteer) => {
  return volunteer.rating * 10 + volunteer.hoursPerWeek * 5 + volunteer.retention * 2 + volunteer.gamificationPoints
}

const AchievementBadge = ({ title, description, icon, color }) => {
  return (
    <div className="group relative transform transition-all duration-300 hover:scale-105 hover:-rotate-1">
      <div
        className={`absolute inset-0 ${color} rounded-xl blur opacity-30 group-hover:opacity-70 transition-opacity duration-300`}
      ></div>
      <div className="relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 group-hover:-translate-y-1">
        <div className="p-6 flex flex-col items-center">
          <div
            className={`w-16 h-16 ${color} bg-opacity-20 rounded-full flex items-center justify-center mb-4 transform transition-transform duration-300 group-hover:rotate-12`}
          >
            {icon}
          </div>
          <h3 className="text-lg font-bold mb-1">{title}</h3>
          <p className="text-gray-500 text-sm text-center">{description}</p>
        </div>
        <div className={`h-1.5 w-full ${color}`}></div>
      </div>
    </div>
  )
}


const MetricCard = ({ title, value, icon, color, suffix }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 1500
    const steps = 60
    const stepValue = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += stepValue
      if (current > value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(current)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 font-medium">{title}</h3>
        <div className={`${color} bg-opacity-20 p-2 rounded-lg`}>{icon}</div>
      </div>
      <div className="flex items-end">
        <span className="text-3xl font-bold">{Math.round(count)}</span>
        <span className="text-gray-500 ml-1">{suffix}</span>
      </div>
    </div>
  )
}

const LeaderboardItem = ({ volunteer, rank, metric, unit }) => {
  if (!volunteer) return null

  const currentRank = rank + 1
  const rankChange = volunteer.previousRank - currentRank

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-3 transform transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100">
              <img
                src={volunteer.avatar || "/placeholder.svg"}
                alt={volunteer.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow">
              {currentRank}
            </div>
          </div>
        </div>

        <div className="flex-grow">
          <h4 className="font-semibold">{volunteer.name}</h4>
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium text-gray-700">
              {volunteer[metric]}
              {unit}
            </span>
            <span className="mx-2">•</span>
            <span>{volunteer.streak} day streak</span>
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center">
          {rankChange > 0 ? (
            <div className="flex items-center text-green-500">
              <ArrowUp size={16} />
              <span className="text-xs ml-1">{rankChange}</span>
            </div>
          ) : rankChange < 0 ? (
            <div className="flex items-center text-red-500">
              <ArrowDown size={16} />
              <span className="text-xs ml-1">{Math.abs(rankChange)}</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-400">
              <span className="text-xs">-</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


// Internal component - not exported
const LeaderboardComponent = ({ title, data = [], sortKey, unit, color }) => {
  // Ensure data is an array before sorting
  const sortedData = Array.isArray(data) ? [...data].sort((a, b) => b[sortKey] - a[sortKey]) : []

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
      <div className={`${color} p-4 flex justify-between items-center`}>
        <h3 className="font-bold text-white">{title}</h3>
        <ChevronRight className="text-white opacity-70" size={20} />
      </div>
      <div className="p-4">
        {sortedData.length > 0 ? (
          sortedData
            .slice(0, 4)
            .map((volunteer, index) => (
              <LeaderboardItem key={volunteer.name} volunteer={volunteer} rank={index} metric={sortKey} unit={unit} />
            ))
        ) : (
          <div className="text-center py-4 text-gray-500">No data available</div>
        )}
      </div>
    </div>
  )
}

const ProgressBar = ({ value, maxValue, color }) => {
  const percentage = (value / maxValue) * 100
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      setWidth(percentage)
    }, 100)
  }, [percentage])

  return (
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${width}%` }}></div>
    </div>
  )
}



const VolunteerDashboard = () => {
  const [contributionData, setContributionData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Calculate contribution scores
    const data = dummyData.map((volunteer) => ({
      ...volunteer,
      contribution: Math.round(calculateContribution(volunteer)),
    }))
    setContributionData(data)
    setIsLoading(false)
  }, [])

  const totalVolunteers = dummyData.length
  const avgRating = dummyData.reduce((sum, vol) => sum + vol.rating, 0) / totalVolunteers
  const totalHours = dummyData.reduce((sum, vol) => sum + vol.hoursPerWeek, 0)
  const avgRetention = dummyData.reduce((sum, vol) => sum + vol.retention, 0) / totalVolunteers

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Volunteer Recognition
          </h1>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Celebrating our outstanding volunteers and their contributions to our educational platform
          </p>
        </header>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MetricCard
            title="Total Volunteers"
            value={totalVolunteers}
            icon={<Users size={20} className="text-blue-500" />}
            color="text-blue-500"
            suffix="active"
          />
          <MetricCard
            title="Average Rating"
            value={avgRating}
            icon={<Star size={20} className="text-yellow-500" />}
            color="text-yellow-500"
            suffix="/5"
          />
          <MetricCard
            title="Weekly Hours"
            value={totalHours}
            icon={<Clock size={20} className="text-green-500" />}
            color="text-green-500"
            suffix="hrs"
          />
          <MetricCard
            title="Retention Rate"
            value={avgRetention}
            icon={<Users size={20} className="text-purple-500" />}
            color="text-purple-500"
            suffix="%"
          />
        </div>

        {/* Achievement Badges */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Achievement Badges</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AchievementBadge
              title="Notes Master"
              description="Downloaded 50+ Notes"
              icon={<Award size={24} className="text-blue-500" />}
              color="bg-blue-500"
            />
            <AchievementBadge
              title="Video Guru"
              description="Uploaded 100+ Lectures"
              icon={<Award size={24} className="text-green-500" />}
              color="bg-green-500"
            />
            <AchievementBadge
              title="Streak Champion"
              description="100 consecutive days login"
              icon={<Award size={24} className="text-yellow-500" />}
              color="bg-yellow-500"
            />
            <AchievementBadge
              title="Top Mentor"
              description="Helped 500+ students"
              icon={<Award size={24} className="text-purple-500" />}
              color="bg-purple-500"
            />
          </div>
        </div>

        {/* Top Volunteers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Top Volunteers</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LeaderboardComponent
              title="Top Rated Volunteers"
              data={dummyData}
              sortKey="rating"
              unit=" stars"
              color="bg-yellow-500"
            />
            <LeaderboardComponent
              title="Most Dedicated"
              data={dummyData}
              sortKey="hoursPerWeek"
              unit=" hrs"
              color="bg-green-500"
            />
            <LeaderboardComponent
              title="Best Student Retention"
              data={dummyData}
              sortKey="retention"
              unit="%"
              color="bg-blue-500"
            />
            <LeaderboardComponent
              title="Total Impact Score"
              data={contributionData}
              sortKey="contribution"
              unit=" pts"
              color="bg-purple-500"
            />
          </div>
        </div>

        {/* Top Performer Spotlight */}
        {contributionData.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Top Performer Spotlight</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-white flex flex-col justify-center items-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
                      <img
                        src={contributionData[0].avatar || "/placeholder.svg"}
                        alt={contributionData[0].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full w-10 h-10 flex items-center justify-center text-gray-800 font-bold shadow-lg">
                      <Trophy size={20} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">{contributionData[0].name}</h3>
                  <p className="text-blue-100 mb-2">Top Contributor</p>
                  <div className="flex items-center">
                    <Star className="text-yellow-300 mr-1" size={16} />
                    <span>{contributionData[0].rating} Rating</span>
                  </div>
                </div>
                <div className="md:w-2/3 p-8">
                  <h4 className="text-lg font-semibold mb-4">Performance Metrics</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Student Retention</span>
                        <span className="text-sm font-medium">{contributionData[0].retention}%</span>
                      </div>
                      <ProgressBar value={contributionData[0].retention} maxValue={100} color="bg-blue-500" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Weekly Hours</span>
                        <span className="text-sm font-medium">{contributionData[0].hoursPerWeek}/20</span>
                      </div>
                      <ProgressBar value={contributionData[0].hoursPerWeek} maxValue={20} color="bg-green-500" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Gamification Points</span>
                        <span className="text-sm font-medium">{contributionData[0].gamificationPoints}/400</span>
                      </div>
                      <ProgressBar
                        value={contributionData[0].gamificationPoints}
                        maxValue={400}
                        color="bg-purple-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Login Streak</span>
                        <span className="text-sm font-medium">{contributionData[0].streak} days</span>
                      </div>
                      <ProgressBar value={contributionData[0].streak} maxValue={100} color="bg-yellow-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>Updated weekly. Last update: April 4, 2025</p>
        </footer>
      </div>
    </div>
  )
}

// Sample data for the standalone leaderboard page
const leaderboardData = [
  {
    name: "David Kim",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4.7,
    hoursPerWeek: 15,
    retention: 90,
    gamificationPoints: 290,
    streak: 45,
    previousRank: 2,
  },
  {
    name: "Alice Johnson",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4.9,
    hoursPerWeek: 20,
    retention: 95,
    gamificationPoints: 320,
    streak: 78,
    previousRank: 1,
  },
  {
    name: "John Doe",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4.5,
    hoursPerWeek: 10,
    retention: 85,
    gamificationPoints: 250,
    streak: 23,
    previousRank: 4,
  },
  {
    name: "Emily Davis",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4.8,
    hoursPerWeek: 18,
    retention: 92,
    gamificationPoints: 310,
    streak: 56,
    previousRank: 3,
  },
  // Additional entries for the standalone page
  {
    name: "Michael Brown",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4.6,
    hoursPerWeek: 12,
    retention: 88,
    gamificationPoints: 275,
    streak: 34,
    previousRank: 5,
  },
  {
    name: "Sarah Wilson",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4.4,
    hoursPerWeek: 14,
    retention: 82,
    gamificationPoints: 260,
    streak: 41,
    previousRank: 6,
  },
  {
    name: "Robert Taylor",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4.3,
    hoursPerWeek: 8,
    retention: 79,
    gamificationPoints: 230,
    streak: 19,
    previousRank: 7,
  },
  {
    name: "Jennifer Martinez",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4.2,
    hoursPerWeek: 9,
    retention: 75,
    gamificationPoints: 215,
    streak: 27,
    previousRank: 8,
  },
]

const Progress = () => {
  // Sort by rating
  const sortedData = [...leaderboardData].sort((a, b) => b.rating - a.rating)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <VolunteerDashboard/>
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Volunteer Leaderboard</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
            <h2 className="text-xl font-bold text-white">Top Rated Volunteers</h2>
            <p className="text-blue-100">Based on student feedback and performance</p>
          </div>

          <div className="p-4">
            {sortedData.map((volunteer, index) => {
              const currentRank = index + 1
              const rankChange = volunteer.previousRank - currentRank

              return (
                <div
                  key={volunteer.name}
                  className="flex items-center p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 mr-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-100">
                        <img
                          src={volunteer.avatar || "/placeholder.svg"}
                          alt={volunteer.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow ${
                          index < 3 ? "bg-yellow-400 text-yellow-800" : "bg-white text-gray-700"
                        }`}
                      >
                        {currentRank}
                      </div>
                    </div>
                  </div>

                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-800">{volunteer.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <div className="flex items-center text-yellow-500 mr-3">
                        <Star size={14} className="mr-1" />
                        <span>{volunteer.rating}</span>
                      </div>
                      <span className="mr-3">{volunteer.hoursPerWeek} hrs/week</span>
                      <span>{volunteer.streak} day streak</span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex items-center">
                    <div className="text-gray-700 font-medium mr-4">{volunteer.gamificationPoints} pts</div>
                    {rankChange > 0 ? (
                      <div className="flex items-center text-green-500">
                        <ArrowUp size={16} />
                        <span className="text-xs ml-1">{rankChange}</span>
                      </div>
                    ) : rankChange < 0 ? (
                      <div className="flex items-center text-red-500">
                        <ArrowDown size={16} />
                        <span className="text-xs ml-1">{Math.abs(rankChange)}</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-400">
                        <span className="text-xs">-</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Progress

