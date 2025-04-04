import React from 'react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// Main component to display and generate volunteer report PDF
const VolunteerReport = ({ volunteerData }) => {
  const generatePDF = async () => {
    const reportElement = document.getElementById('volunteer-report');
    
    // Show loading indicator
    setIsGenerating(true);
    
    try {
      // Create PDF document with A4 size
      const pdf = new jsPDF('p', 'pt', 'a4');
      
      // Convert HTML element to canvas
      const canvas = await html2canvas(reportElement, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        allowTaint: true
      });
      
      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions to fit A4 page
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Save the PDF
      pdf.save(`${volunteerData.name.replace(' ', '_')}_Report.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // State for tracking PDF generation
  const [isGenerating, setIsGenerating] = React.useState(false);
  
  // Format date from ISO string
  const formatDate = (dateString) => {
    if (!dateString) return "Not Available";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Current date for report footer
  const currentDate = "April 04, 2025";

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Download button */}
      <div className="flex justify-end mb-4">
        <button 
          onClick={generatePDF}
          disabled={isGenerating}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          {isGenerating ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>
      
      {/* Report content - Will be converted to PDF */}
      <div id="volunteer-report" className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Volunteer Performance Report</h1>
        
        {/* Executive Summary */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-700 border-b pb-2 mb-4">Executive Summary</h2>
          <p className="text-gray-700 leading-relaxed">
            <span className="font-bold">{volunteerData.name}</span> has been an active volunteer since {formatDate(volunteerData.createdAt)}, 
            maintaining an exceptional performance rating of <span className="font-bold">{volunteerData.rating}/5.0</span> with {volunteerData.hours_taught} hours 
            of teaching completed. With a student retention rate of {volunteerData.student_retention}%, {volunteerData.name.split(' ')[0]} demonstrates 
            outstanding engagement capabilities and commitment to educational excellence.
          </p>
        </section>
        
        {/* Volunteer Profile */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-700 border-b pb-2 mb-4">Volunteer Profile</h2>
          
          {/* Contact Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold bg-gray-50 w-1/3">Name</td>
                    <td className="border border-gray-300 px-4 py-2">{volunteerData.name}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold bg-gray-50">Email</td>
                    <td className="border border-gray-300 px-4 py-2">{volunteerData.email}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold bg-gray-50">Phone</td>
                    <td className="border border-gray-300 px-4 py-2">{volunteerData.phone}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold bg-gray-50">ID</td>
                    <td className="border border-gray-300 px-4 py-2">{volunteerData.volunteer_id}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Qualifications */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Qualifications</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li><span className="font-semibold">Skills:</span> {volunteerData.skills?.length || 0} verified skills in teaching database</li>
              <li><span className="font-semibold">Languages:</span> Proficient in {volunteerData.languages?.length || 0} languages</li>
              <li><span className="font-semibold">Service Locations:</span> Available in {volunteerData.locations?.length || 0} registered locations</li>
            </ul>
          </div>
        </section>
        
        {/* Performance Metrics */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-700 border-b pb-2 mb-4">Performance Metrics</h2>
          
          <h3 className="text-lg font-semibold mb-3">Key Indicators</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Metric</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Value</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Industry Benchmark</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Hours Taught</td>
                  <td className="border border-gray-300 px-4 py-2">{volunteerData.hours_taught}</td>
                  <td className="border border-gray-300 px-4 py-2">100</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">Rating</td>
                  <td className="border border-gray-300 px-4 py-2">{volunteerData.rating}/5.0</td>
                  <td className="border border-gray-300 px-4 py-2">4.2/5.0</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Student Retention</td>
                  <td className="border border-gray-300 px-4 py-2">{volunteerData.student_retention}%</td>
                  <td className="border border-gray-300 px-4 py-2">85%</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">Gamification Points</td>
                  <td className="border border-gray-300 px-4 py-2">{volunteerData.gamification_points}</td>
                  <td className="border border-gray-300 px-4 py-2">400</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        
        {/* Availability & Preferences */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-700 border-b pb-2 mb-4">Availability & Preferences</h2>
          
          <h3 className="text-lg font-semibold mb-3">Schedule Details</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li><span className="font-semibold">Availability Pattern:</span> {volunteerData.availability}</li>
            <li><span className="font-semibold">Maximum Commitment:</span> {volunteerData.max_hours_per_week} hours per week</li>
            <li><span className="font-semibold">Current Status:</span> {volunteerData.available === "yes" ? "Available for assignment" : "Not available"}</li>
            <li><span className="font-semibold">Preferred Mode:</span> {volunteerData.location_type_preference.charAt(0).toUpperCase() + volunteerData.location_type_preference.slice(1)} teaching</li>
          </ul>
        </section>
        
        {/* Account Timeline */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-700 border-b pb-2 mb-4">Account Timeline</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li><span className="font-semibold">Onboarding Date:</span> {formatDate(volunteerData.createdAt)}</li>
            <li><span className="font-semibold">Last Profile Update:</span> {formatDate(volunteerData.updatedAt)}</li>
            <li><span className="font-semibold">Account Status:</span> Active volunteer</li>
          </ul>
        </section>
        
        {/* Recommendations */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-700 border-b pb-2 mb-4">Recommendations</h2>
          <p className="mb-3 text-gray-700">Based on {volunteerData.name.split(' ')[0]}'s exceptional performance metrics and consistent availability, we recommend:</p>
          <ol className="list-decimal pl-6 space-y-1 text-gray-700">
            <li>Consider for specialized advanced courses</li>
            <li>Potential mentor role for new volunteers</li>
            <li>Eligible for quarterly performance recognition</li>
          </ol>
        </section>
        
        {/* Footer */}
        <div className="mt-12 pt-4 border-t border-gray-200 text-center text-gray-500 italic">
          <p>This report was automatically generated on {currentDate}</p>
        </div>
      </div>
    </div>
  );
};

// Usage example
const VolunteerReportPage = () => {
  // Sample volunteer data
  const volunteerData = {
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "9876543210",
    skills: ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
    locations: ["Location 1", "Location 2"],
    languages: ["Language 1", "Language 2", "Language 3"],
    availability: "Weekdays",
    hours_taught: 120,
    gamification_points: 450,
    role: "volunteer",
    createdAt: "2024-12-15T14:22:45.992+00:00",
    updatedAt: "2025-04-01T16:46:45.992+00:00",
    volunteer_id: 2,
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    location_type_preference: "remote",
    max_hours_per_week: 15,
    rating: 4.8,
    student_retention: 92,
    available: "yes"
  };


   const realData = fetch("http://localhost:5000/volunteer/10", {
    method: "GET",
   })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.error("Error fetching volunteer data:", error);
    });
    

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Volunteer Performance Dashboard</h1>
        <VolunteerReport volunteerData={volunteerData} />
      </div>
    </div>
  );
};

export default VolunteerReportPage;
