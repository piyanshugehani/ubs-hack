"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Check, X, BookOpen, Tag, ListChecks } from 'lucide-react'

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
  
  // Get percentage of assigned topics
  const assignedPercentage = Math.round((assignedTopics / totalTopics) * 100)

  return (
    <div className="w-full  rounded-xl border border-gray-200 overflow-hidden">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              Syllabus
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Course curriculum and assigned topics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${assignedPercentage}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-600 mt-1">{assignedPercentage}% assigned</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                {syllabusData.length}
              </span>
              <span className="text-sm font-medium px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-800 flex items-center gap-1.5">
                <ListChecks className="h-3.5 w-3.5" />
                {assignedTopics}/{totalTopics}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="w-full">
        <table className="w-full border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-[15%] px-6 py-4 text-left font-semibold text-gray-700">Class</th>
              <th className="w-[30%] px-6 py-4 text-left font-semibold text-gray-700">Chapter</th>
              <th className="w-[25%] px-6 py-4 text-left font-semibold text-gray-700">Subject</th>
              <th className="w-[30%] px-6 py-4 text-left font-semibold text-gray-700">Topics</th>
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody>
            {syllabusData.map((item, index) => (
              <>
                <tr 
                  key={`row-${index}`} 
                  className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-all ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                  onClick={() => toggleExpand(index)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-1 rounded-md transition-colors ${item.expanded ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                        {item.expanded ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                      </div>
                      <span className="font-medium px-2.5 py-1 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700">
                        {item.class}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">{item.chapter}</td>
                  <td className="px-6 py-4 text-gray-700">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                      {item.subject}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {item.topics.slice(0, 3).map((topic, i) => (
                          <div 
                            key={i} 
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white ${
                              topic.assigned 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {topic.name.charAt(0)}
                          </div>
                        ))}
                        {item.topics.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium border-2 border-white">
                            +{item.topics.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm font-medium">
                          {item.topics.length} topics
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          item.topics.filter(t => t.assigned).length > 0 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {item.topics.filter(t => t.assigned).length} assigned
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
                
                {/* Expanded content row */}
                {item.expanded && (
                  <tr key={`expanded-${index}`} className="border-b border-gray-200">
                    <td colSpan={4} className="p-0">
                      <div className="p-4 pl-16 bg-gray-50/80">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 w-full shadow-sm">
                          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Tag className="h-4 w-4 text-blue-600" />
                            Topics in {item.chapter}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {item.topics.map((topic, topicIndex) => (
                              <div 
                                key={topicIndex} 
                                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all bg-white"
                              >
                                <span className="font-medium text-gray-800">{topic.name}</span>
                                {topic.assigned ? (
                                  <span className="ml-2 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs font-medium flex items-center">
                                    <Check className="mr-1.5 h-3.5 w-3.5" />
                                    Assigned
                                  </span>
                                ) : (
                                  <span className="ml-2 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-xs font-medium flex items-center">
                                    <X className="mr-1.5 h-3.5 w-3.5" />
                                    Not Assigned
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}