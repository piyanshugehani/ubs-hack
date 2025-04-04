"use client"

import { useState } from "react"
import { Save, School, Users, MapPin, Phone, Mail, Globe, Plus, Trash2, Upload, Building, BookOpen } from 'lucide-react'

function Settings() {
  const [formData, setFormData] = useState({
    schoolName: "Westview Academy",
    principalName: "Dr. Alexandra Thompson",
    established: "1985",
    email: "contact@westviewacademy.edu",
    phone: "(555) 123-4567",
    website: "westviewacademy.edu",
    address: "123 Education Lane, Learning City, 90210",
    studentCount: 850,
    staffCount: 65,
    facilities: [
      { id: 1, name: "Main Building", type: "Academic", capacity: 500 },
      { id: 2, name: "Science Lab", type: "Laboratory", capacity: 60 },
      { id: 3, name: "Sports Complex", type: "Athletics", capacity: 200 }
    ],
    programs: [
      { id: 1, name: "General Education", grades: "K-12", students: 650 },
      { id: 2, name: "STEM Focus", grades: "9-12", students: 120 },
      { id: 3, name: "Arts Program", grades: "6-12", students: 80 }
    ],
    logo: null
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFacilityChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.map(facility => 
        facility.id === id ? { ...facility, [field]: value } : facility
      )
    }))
  }

  const handleProgramChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      programs: prev.programs.map(program => 
        program.id === id ? { ...program, [field]: value } : program
      )
    }))
  }

  const addFacility = () => {
    const newId = formData.facilities.length > 0 
      ? Math.max(...formData.facilities.map(f => f.id)) + 1 
      : 1
    
    setFormData(prev => ({
      ...prev,
      facilities: [...prev.facilities, { id: newId, name: "", type: "", capacity: 0 }]
    }))
  }

  const removeFacility = (id) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.filter(facility => facility.id !== id)
    }))
  }

  const addProgram = () => {
    const newId = formData.programs.length > 0 
      ? Math.max(...formData.programs.map(p => p.id)) + 1 
      : 1
    
    setFormData(prev => ({
      ...prev,
      programs: [...prev.programs, { id: newId, name: "", grades: "", students: 0 }]
    }))
  }

  const removeProgram = (id) => {
    setFormData(prev => ({
      ...prev,
      programs: prev.programs.filter(program => program.id !== id)
    }))
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically save the data to your backend
    console.log('Saving settings:', formData)
    alert('Settings saved successfully!')
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">School Settings</h1>
          <p className="text-gray-600">Manage your school's information and configuration</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-8">
            {/* Basic Information Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-6">
                <School className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <div className="flex flex-col mb-4">
                    <label htmlFor="logo" className="text-sm font-medium text-gray-700 mb-1">School Logo</label>
                    <div className="flex items-center">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mr-4 border-2 border-dashed border-gray-300">
                        {formData.logo ? (
                          <img src={formData.logo} alt="School logo" className="w-full h-full object-cover" />
                        ) : (
                          <School className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                      <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md text-sm font-medium inline-flex items-center">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Logo
                        <input type="file" className="hidden" accept="image/*" />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                  <input
                    type="text"
                    id="schoolName"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="principalName" className="block text-sm font-medium text-gray-700 mb-1">Principal Name</label>
                  <input
                    type="text"
                    id="principalName"
                    name="principalName"
                    value={formData.principalName}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="established" className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                  <input
                    type="text"
                    id="established"
                    name="established"
                    value={formData.established}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="studentCount" className="block text-sm font-medium text-gray-700 mb-1">Number of Students</label>
                  <input
                    type="number"
                    id="studentCount"
                    name="studentCount"
                    value={formData.studentCount}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="staffCount" className="block text-sm font-medium text-gray-700 mb-1">Number of Staff</label>
                  <input
                    type="number"
                    id="staffCount"
                    name="staffCount"
                    value={formData.staffCount}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <div className="flex items-center">
                    <MapPin className="text-gray-400 w-5 h-5 absolute ml-3" />
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-6">
                <Mail className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="flex items-center">
                    <Mail className="text-gray-400 w-5 h-5 absolute ml-3" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="flex items-center">
                    <Phone className="text-gray-400 w-5 h-5 absolute ml-3" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <div className="flex items-center">
                    <Globe className="text-gray-400 w-5 h-5 absolute ml-3" />
                    <input
                      type="text"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Facilities Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Building className="h-6 w-6 text-blue-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">Facilities</h2>
                </div>
                <button 
                  type="button"
                  onClick={addFacility}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Facility
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.facilities.map((facility) => (
                  <div key={facility.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="md:col-span-5">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Facility Name</label>
                      <input
                        type="text"
                        value={facility.name}
                        onChange={(e) => handleFacilityChange(facility.id, 'name', e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                      <input
                        type="text"
                        value={facility.type}
                        onChange={(e) => handleFacilityChange(facility.id, 'type', e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Capacity</label>
                      <input
                        type="number"
                        value={facility.capacity}
                        onChange={(e) => handleFacilityChange(facility.id, 'capacity', e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-1 flex items-end justify-center">
                      <button
                        type="button"
                        onClick={() => removeFacility(facility.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}

                {formData.facilities.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No facilities added yet. Click "Add Facility" to get started.
                  </div>
                )}
              </div>
            </div>

            {/* Programs Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">Educational Programs</h2>
                </div>
                <button 
                  type="button"
                  onClick={addProgram}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Program
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.programs.map((program) => (
                  <div key={program.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="md:col-span-5">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Program Name</label>
                      <input
                        type="text"
                        value={program.name}
                        onChange={(e) => handleProgramChange(program.id, 'name', e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Grade Levels</label>
                      <input
                        type="text"
                        value={program.grades}
                        onChange={(e) => handleProgramChange(program.id, 'grades', e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g. K-5, 9-12"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Enrolled Students</label>
                      <input
                        type="number"
                        value={program.students}
                        onChange={(e) => handleProgramChange(program.id, 'students', e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-1 flex items-end justify-center">
                      <button
                        type="button"
                        onClick={() => removeProgram(program.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}

                {formData.programs.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No programs added yet. Click "Add Program" to get started.
                  </div>
                )}
              </div>
            </div>

            {/* Footer with save button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Save className="h-5 w-5 mr-2" />
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Settings