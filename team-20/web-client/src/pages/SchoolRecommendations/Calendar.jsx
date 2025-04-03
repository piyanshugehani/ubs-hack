/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
export function Calendar({ busyDates, onSelectDate, selectedDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState([])

  // Format date as YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split("T")[0]
  }

  // Check if a date is in the busy dates array
  const isDateBusy = (date) => {
    return busyDates.includes(formatDate(date))
  }

  // Check if a date is in the past
  const isDatePast = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  // Generate calendar days for the current month
  useEffect(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    // First day of the month
    const firstDay = new Date(year, month, 1)
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0)

    // Day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay()

    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek

    // Calculate total days to show (max 42 for 6 weeks)
    const totalDays = 42

    const days = []

    // Add days from previous month
    const prevMonth = new Date(year, month, 0)
    const prevMonthDays = prevMonth.getDate()

    for (let i = prevMonthDays - daysFromPrevMonth + 1; i <= prevMonthDays; i++) {
      days.push({
        date: new Date(year, month - 1, i),
        isCurrentMonth: false,
      })
    }

    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      })
    }

    // Add days from next month
    const remainingDays = totalDays - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      })
    }

    setCalendarDays(days)
  }, [currentMonth])

  // Go to previous month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  // Go to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Format month name
  const monthName = currentMonth.toLocaleString("default", { month: "long" })

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h3 className="font-medium text-gray-900">
          {monthName} {currentMonth.getFullYear()}
        </h3>

        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar Days */}
      <div className="p-4">
        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (!day.date) return <div key={index} className="h-10" />

            const dateString = formatDate(day.date)
            const isSelected = selectedDate === dateString
            const isBusy = isDateBusy(day.date)
            const isPast = isDatePast(day.date)

            return (
              <button
                key={index}
                onClick={() => !isPast && !isBusy && onSelectDate(dateString)}
                disabled={isPast || isBusy}
                className={`
                  h-10 rounded-md flex items-center justify-center text-sm
                  ${!day.isCurrentMonth ? "text-gray-400" : "text-gray-900"}
                  ${isSelected ? "bg-blue-600 text-white" : ""}
                  ${!isSelected && !isPast && !isBusy && day.isCurrentMonth ? "hover:bg-gray-100" : ""}
                  ${isPast ? "text-gray-300 cursor-not-allowed" : ""}
                  ${isBusy ? "bg-red-100 text-red-800 cursor-not-allowed" : ""}
                `}
              >
                {day.date.getDate()}
              </button>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 border-t flex items-center justify-center space-x-4 text-xs">
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-red-100 mr-1"></div>
          <span className="text-gray-600">Busy</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-blue-600 mr-1"></div>
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-gray-100 mr-1"></div>
          <span className="text-gray-600">Available</span>
        </div>
      </div>
    </div>
  )
}