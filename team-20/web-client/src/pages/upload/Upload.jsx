"use client"

import React from "react"

import { useState, useRef } from "react"
import { Upload, FileText, Check, X, ChevronRight, ChevronDown, BookOpen, Filter, Download } from "lucide-react"

export default function SyllabusUpload() {
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isExtracted, setIsExtracted] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)
  const fileInputRef = useRef(null)

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

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      setFile(droppedFile)
      setIsExtracted(false)
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setIsExtracted(false)
    }
  }

  const handleFileUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleExtract = () => {
    if (file) {
      // In a real app, you would parse the syllabus file here
      // and update the syllabusData state
      setIsExtracted(true)
    }
  }

  const toggleChapter = (index) => {
    const updatedData = [...syllabusData]
    updatedData[index].expanded = !updatedData[index].expanded
    setSyllabusData(updatedData)
  }

  const filteredData = selectedClass ? syllabusData.filter((item) => item.class === selectedClass) : syllabusData

  const uniqueClasses = Array.from(new Set(syllabusData.map((item) => item.class))).sort()

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <BookOpen className="mr-2 text-indigo-600" />
          Syllabus Upload & Management
        </h1>

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Section */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Upload className="mr-2 text-indigo-500" size={20} />
                Upload Syllabus
              </h2>

              <div
                className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors
                  ${isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50"}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleFileUploadClick}
              >
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                />

                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-12 h-12 text-indigo-500 mb-3" />
                  <h3 className="text-base font-medium text-gray-700 mb-1">Drag and drop your syllabus file here</h3>
                  <p className="text-sm text-gray-500 mb-3">or click to browse your files</p>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors text-sm">
                    Choose File
                  </button>
                </div>
              </div>
            </div>

            {/* File Info & Controls */}
            <div className="border-l-0 lg:border-l border-gray-200 lg:pl-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="mr-2 text-indigo-500" size={20} />
                File Information
              </h2>

              {file ? (
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-md p-4 flex items-center bg-gray-50">
                    <div className="bg-indigo-100 p-3 rounded-md mr-4">
                      <FileText className="text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Filter className="w-4 h-4 text-gray-500 mr-2" />
                      <label htmlFor="class-filter" className="text-sm font-medium text-gray-700">
                        Filter by Class:
                      </label>
                    </div>
                    <select
                      id="class-filter"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={selectedClass || ""}
                      onChange={(e) => setSelectedClass(e.target.value ? Number(e.target.value) : null)}
                    >
                      <option value="">All Classes</option>
                      {uniqueClasses.map((classNum) => (
                        <option key={classNum} value={classNum}>
                          Class {classNum}
                        </option>
                      ))}
                    </select>

                    <button
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center"
                      onClick={handleExtract}
                      disabled={!file}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Extract Content
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-md p-6 text-center text-gray-500 bg-gray-50">
                  <p className="text-sm">No file uploaded yet</p>
                  <p className="text-xs mt-1">Upload a file to see information</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Syllabus Preview Section */}
        {file && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <BookOpen className="mr-2 text-indigo-500" />
                Syllabus Content
              </h2>

              {isExtracted && (
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Showing {filteredData.length} chapters</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Extracted
                  </span>
                </div>
              )}
            </div>

            {isExtracted ? (
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2"
                          >
                            Chapter / Topic
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Subject
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Class
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredData.map((chapter, chapterIndex) => (
                          <React.Fragment key={`chapter-${chapterIndex}`}>
                            <tr
                              className="bg-gray-50 cursor-pointer hover:bg-gray-100"
                              onClick={() => toggleChapter(chapterIndex)}
                            >
                              <td className="px-6 py-4 text-sm font-medium text-gray-900 flex items-center">
                                {chapter.expanded ? (
                                  <ChevronDown className="w-4 h-4 mr-2 text-indigo-500 flex-shrink-0" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 mr-2 text-indigo-500 flex-shrink-0" />
                                )}
                                <span className="truncate">{chapter.chapter}</span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700">{chapter.subject}</td>
                              <td className="px-6 py-4 text-sm text-gray-700">Class {chapter.class}</td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                <span className="text-xs font-medium">
                                  {chapter.topics.filter((t) => t.assigned).length}/{chapter.topics.length} assigned
                                </span>
                              </td>
                            </tr>

                            {chapter.expanded &&
                              chapter.topics.map((topic, topicIndex) => (
                                <tr key={`topic-${chapterIndex}-${topicIndex}`} className="hover:bg-gray-50">
                                  <td className="px-6 py-3 text-sm text-gray-500 pl-12">{topic.name}</td>
                                  <td className="px-6 py-3 text-sm text-gray-500">
                                    {/* Empty cell for subject column */}
                                  </td>
                                  <td className="px-6 py-3 text-sm text-gray-500">
                                    {/* Empty cell for class column */}
                                  </td>
                                  <td className="px-6 py-3 text-sm">
                                    {topic.assigned ? (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <Check className="w-3 h-3 mr-1" />
                                        Assigned
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        <X className="w-3 h-3 mr-1" />
                                        Not Assigned
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center bg-gray-50">
                <Download className="w-16 h-16 text-indigo-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Click "Extract Content" to view syllabus</h3>
                <p className="text-sm text-gray-500 text-center max-w-md">
                  After uploading your syllabus file, click the "Extract Content" button to analyze and display the
                  syllabus structure.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!file && (
          <div className="bg-white rounded-lg shadow-md p-12 flex flex-col items-center justify-center">
            <FileText className="w-20 h-20 text-indigo-200 mb-6" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Syllabus Uploaded</h3>
            <p className="text-base text-gray-500 text-center max-w-md mb-6">
              Upload a syllabus file to view and manage its content. You can drag and drop a file or use the file
              browser.
            </p>
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md transition-colors"
              onClick={handleFileUploadClick}
            >
              Upload Syllabus
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

