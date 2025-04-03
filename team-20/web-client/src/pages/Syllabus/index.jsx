"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Check, X } from 'lucide-react'

export default function SyllabusTable() {
  const [syllabusData, setSyllabusData] = useState([
    {
      class: 1,
      chapter: "Introduction to Computer Science",
      subject: "Programming",
      topics: [
        { name: "History of Computing", assigned: false },
        { name: "Basic Computer Architecture", assigned: true },
      ],
      expanded: true,
    },
    {
      class: 1,
      chapter: "Data Structures and Algorithms",
      subject: "Programming",
      topics: [
        { name: "Arrays and Linked Lists", assigned: true },
        { name: "Sorting Algorithms", assigned: false },
        { name: "Tree Structures", assigned: true },
      ],
      expanded: true,
    },
    {
      class: 2,
      chapter: "Object-Oriented Programming",
      subject: "Advanced Programming",
      topics: [
        { name: "Classes and Objects", assigned: false },
        { name: "Inheritance and Polymorphism", assigned: true },
        { name: "Design Patterns", assigned: false },
      ],
      expanded: true,
    },
    {
      class: 3,
      chapter: "Database Systems",
      subject: "Information Systems",
      topics: [
        { name: "Relational Database Design", assigned: true },
        { name: "SQL Fundamentals", assigned: true },
        { name: "Database Normalization", assigned: false },
        { name: "Transaction Processing", assigned: false },
      ],
      expanded: true,
    },
  ])

  const toggleExpand = (index) => {
    setSyllabusData(
      syllabusData.map((item, i) => 
        i === index ? { ...item, expanded: !item.expanded } : item
      )
    )
  }

  // Count total topics and assigned topics
  const totalTopics = syllabusData.reduce((acc, item) => acc + item.topics.length, 0)
  const assignedTopics = syllabusData.reduce(
    (acc, item) => acc + item.topics.filter(topic => topic.assigned).length, 
    0
  )

  return (
    <div className="w-full shadow-md rounded-lg border border-gray-200">
      {/* Card Header */}
      <div className="bg-slate-50 border-b p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h3 className="text-2xl font-bold">Syllabus</h3>
            <p className="text-gray-500 text-sm">
              Course curriculum and assigned topics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-normal px-2 py-1 rounded-full border border-gray-300 text-gray-700">
              {syllabusData.length} Chapters
            </span>
            <span className="text-sm font-normal px-2 py-1 rounded-full border border-gray-300 text-gray-700">
              {totalTopics} Topics
            </span>
            <span className="text-sm font-normal px-2 py-1 rounded-full bg-blue-600 text-white">
              {assignedTopics} Assigned
            </span>
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="w-full overflow-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead>
            <tr className="bg-slate-50 hover:bg-slate-50">
              <th className="w-[50px] p-4 text-left"></th>
              <th className="w-[80px] p-4 text-left font-medium text-gray-700">Class</th>
              <th className="w-[250px] p-4 text-left font-medium text-gray-700">Chapter</th>
              <th className="w-[200px] p-4 text-left font-medium text-gray-700">Subject</th>
              <th className="p-4 text-left font-medium text-gray-700">Topics</th>
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody>
            {syllabusData.map((item, index) => (
              <tr key={index} className="group border-b border-gray-200 hover:bg-gray-50">
                <td className="p-4">
                  <button 
                    onClick={() => toggleExpand(index)}
                    className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    {item.expanded ? 
                      <ChevronDown className="h-4 w-4 transition-transform duration-200" /> : 
                      <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                    }
                  </button>
                </td>
                <td className="p-4">
                  <span className="font-medium px-2 py-0.5 bg-slate-50 border border-gray-200 rounded-md text-sm">
                    {item.class}
                  </span>
                </td>
                <td className="p-4 font-medium">{item.chapter}</td>
                <td className="p-4">{item.subject}</td>
                <td className="p-4">
                  {item.expanded ? (
                    <div className="space-y-3 py-1">
                      {item.topics.map((topic, topicIndex) => (
                        <div 
                          key={topicIndex} 
                          className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                        >
                          <span className="font-medium text-sm">{topic.name}</span>
                          {topic.assigned ? (
                            <span className="ml-2 bg-green-100 text-green-800 hover:bg-green-200 px-2 py-1 rounded-full text-xs flex items-center">
                              <Check className="mr-1 h-3 w-3" />
                              Assigned
                            </span>
                          ) : (
                            <span className="ml-2 text-slate-500 border border-gray-200 px-2 py-1 rounded-full text-xs flex items-center">
                              <X className="mr-1 h-3 w-3" />
                              Not Assigned
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">
                        {item.topics.length} topics
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-sm">
                        <span className="font-normal text-xs border border-gray-200 px-2 py-0.5 rounded-full">
                          {item.topics.filter(t => t.assigned).length} assigned
                        </span>
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}