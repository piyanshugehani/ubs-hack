import React, { useState, useEffect } from 'react';
import { format, formatDistance, isBefore, isAfter, parseISO } from 'date-fns';
import Video from './Video';

// Mock data (replace with API calls later)
const mockSessions = [
  {
    id: 1,
    title: "First-time Mentor Orientation",
    date: "2025-04-04T14:00:00Z",
    mentorName: "Sarah Johnson",
    status: "upcoming",
    notes: ""
  },
  {
    id: 2,
    title: "Career Guidance Workshop",
    date: "2025-04-03T16:30:00Z",
    mentorName: "Michael Chang",
    status: "live",
    notes: ""
  },
  {
    id: 3,
    title: "Resume Review Session",
    date: "2025-03-28T15:00:00Z",
    mentorName: "Elena Rodriguez",
    status: "completed",
    notes: "Discussed improving action verbs, quantifying achievements, and restructuring education section. Follow-up needed on portfolio links."
  },
  {
    id: 4,
    title: "Mock Interview Practice",
    date: "2025-03-25T13:00:00Z",
    mentorName: "David Wilson",
    status: "completed",
    notes: "Strengths: technical knowledge, problem-solving approach. Areas to improve: concise communication, handling stress questions."
  }
];

const Sessions = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [sessions, setSessions] = useState([]);
  const [isInCall, setIsInCall] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [filteredPastSessions, setFilteredPastSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortDirection, setSortDirection] = useState('asc');
  
  useEffect(() => {
    // Initialize with mock data
    setSessions(mockSessions);
    setFilteredPastSessions(mockSessions.filter(session => session.status === 'completed'));
  }, []);

  const handleSession = (session) => {
    setCurrentSession(session);
    setIsInCall(true);
  };

  const handleJoinCall = (session) => {
    setCurrentSession(session);
    setIsInCall(true);
  };

  const upcomingAndLiveSessions = sessions.filter(
    session => session.status === 'upcoming' || session.status === 'live'
  ).sort((a, b) => {
    const dateA = parseISO(a.date);
    const dateB = parseISO(b.date);
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const pastSessions = sessions.filter(session => session.status === 'completed');

  useEffect(() => {
    let filtered = pastSessions;
    
    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter(session => 
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.mentorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.notes.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));
      
      filtered = filtered.filter(session => {
        const sessionDate = parseISO(session.date);
        switch(dateFilter) {
          case '30days':
            return isAfter(sessionDate, thirtyDaysAgo);
          case '90days':
            return isAfter(sessionDate, ninetyDaysAgo);
          default:
            return true;
        }
      });
    }
    
    setFilteredPastSessions(filtered);
  }, [searchQuery, dateFilter, pastSessions]);
  
  // Toggle sort direction
  const toggleSort = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  // Countdown timer calculation
  const getCountdown = (dateString) => {
    const sessionDate = parseISO(dateString);
    const now = new Date();
    if (isBefore(sessionDate, now)) return "Live now";
    return formatDistance(sessionDate, now, { addSuffix: true });
  };

  // Handle file download (mock functionality)
  const handleDownload = (sessionId, format) => {
    alert(`Downloading notes for session #${sessionId} in ${format} format`);
    // Actual implementation would connect to an API
  };

  // Handle file upload (mock functionality)
  const handleUpload = (sessionId) => {
    const newNotes = prompt("Enter updated notes:");
    if (newNotes) {
      setSessions(prev => 
        prev.map(session => 
          session.id === sessionId ? {...session, notes: newNotes} : session
        )
      );
    }
  };

  return (
    <>
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-50 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Live Sessions</h1>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`py-2 px-4 font-medium text-sm transition-colors duration-200 ${
            activeTab === 'upcoming' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Live & Upcoming Sessions
        </button>
        {/* <button 
          onClick={() => setActiveTab('past')}
          className={`py-2 px-4 font-medium text-sm transition-colors duration-200 ${
            activeTab === 'past' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Past Session Notes
        </button> */}
      </div>
      
      {/* Live & Upcoming Sessions Tab */}
      {activeTab === 'upcoming' && (
        <div className="animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Live & Upcoming Sessions</h2>
            <button 
              onClick={toggleSort}
              className="flex items-center px-3 py-1 bg-white border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
            >
              Sort by Date {sortDirection === 'asc' ? '↑' : '↓'}
            </button>
          </div>
          
          {upcomingAndLiveSessions.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No upcoming sessions scheduled.</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Browse Available Sessions
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {upcomingAndLiveSessions.map(session => (
                <div key={session.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  {session.status === 'live' && (
                    <div className="flex items-center mb-2">
                      <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
                      <span className="text-sm font-medium text-red-500">LIVE NOW</span>
                    </div>
                  )}
                  
                  <h3 className="font-semibold text-gray-800">{session.title}</h3>
                  
                  <div className="mt-2 text-sm text-gray-600">
                    <div className="flex items-center mb-1">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {format(parseISO(session.date), 'MMM d, yyyy • h:mm a')}
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      {session.mentorName}
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                      {getCountdown(session.date)}
                    </span>
                    
                    {session.status === 'live' ? (
                      <button className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium" onClick={handleSession}>
                        Join Now
                      </button>
                    ) : (
                      <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors text-sm">
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Past Sessions Tab */}
      {activeTab === 'past' && (
        <div className="animate-fadeIn">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Past Session Notes</h2>
            
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-grow">
                <input 
                  type="text" 
                  placeholder="Search by keyword..." 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <select 
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Dates</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
            </div>
          </div>
          
          {filteredPastSessions.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No past sessions found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPastSessions.map(session => (
                <div key={session.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">{session.title}</h3>
                      <div className="mt-1 text-sm text-gray-600">
                        <span className="mr-3">{format(parseISO(session.date), 'MMM d, yyyy')}</span>
                        <span>Mentor: {session.mentorName}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-3 md:mt-0">
                      <div className="relative group">
                        <button className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-sm">
                          Download
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          <div className="py-1">
                            <button 
                              onClick={() => handleDownload(session.id, 'PDF')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Download as PDF
                            </button>
                            <button 
                              onClick={() => handleDownload(session.id, 'DOCX')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Download as DOCX
                            </button>
                            <button 
                              onClick={() => handleDownload(session.id, 'TXT')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Download as TXT
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleUpload(session.id)}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors text-sm"
                      >
                        Upload Notes
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    {session.notes ? (
                      <p className="text-sm text-gray-700">{session.notes}</p>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No notes available for this session.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
    
    {isInCall && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop with blur effect */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setIsInCall(false)}
        />
        
        {/* Modal container with animation */}
        <div className="relative w-full max-w-6xl h-[100vh] bg-white rounded-lg shadow-2xl m-4 transform transition-all duration-300 ease-in-out animate-modal-pop">
          <button 
            onClick={() => setIsInCall(false)}
            className="absolute top-5 right-8 z-10 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
            aria-label="Close video call"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="w-full h-full rounded-lg overflow-hidden">
            <Video />
          </div>
        </div>
      </div>
    )}

    {/* Modal animation keyframes */}
    <style jsx>{`
      @keyframes modalPop {
        0% { 
          opacity: 0;
          transform: scale(0.9);
        }
        100% { 
          opacity: 1;
          transform: scale(1);
        }
      }
      .animate-modal-pop {
        animation: modalPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
    `}</style>
    
    </>
  );
};

export default Sessions;