/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"

export function VolunteerCard({ volunteer, isSelected, onClick }) {
    return (
      <div
        className={`cursor-pointer border rounded-lg p-4 transition-all hover:shadow-md ${
          isSelected ? "border-blue-500 ring-2 ring-blue-500 ring-opacity-50" : "border-gray-200"
        }`}
        onClick={onClick}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-8 w-8 rounded-full overflow-hidden">
              <img
                src={volunteer.avatar || "https://via.placeholder.com/48"}
                alt={volunteer.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div
              className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${
                volunteer.available === "yes"
                  ? "bg-green-500"
                  : volunteer.available === "limited"
                    ? "bg-amber-500"
                    : "bg-red-500"
              }`}
            />
          </div>
  
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate text-gray">{volunteer.name}</h3>
            <div className="flex items-center text-xs text-gray-500 gap-1 mt-0.5">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{volunteer.locations}</span>
            </div>
          </div>
        </div>
  
        <div className="mt-3 flex flex-wrap gap-1.5">
          {volunteer.skills.slice(0, 2).map((skill, i) => (
            <span
              key={i}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {skill}
            </span>
          ))}
          {volunteer.skills.length > 2 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600">
              +{volunteer.skills.length - 2}
            </span>
          )}
        </div>
  
        <div className="mt-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <svg className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{volunteer.hours_taught} hrs</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="h-3 w-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{volunteer.rating}</span>
          </div>
        </div>
      </div>
    )
  }