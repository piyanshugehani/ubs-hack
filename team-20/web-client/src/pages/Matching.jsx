import React, { useState, useEffect } from 'react';
import { format, formatDistance, isBefore, parseISO } from 'date-fns';
import Video from './Video';

const Matching = () => {
  // Get the current logged-in teacher ID - in a real app, this would come from authentication context
  const currentTeacherId = 1; // This would come from auth context
  
  const [activeTab, setActiveTab] = useState('unassigned');
  const [slots, setSlots] = useState([]);
  const [isInCall, setIsInCall] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(null);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [sortDirection, setSortDirection] = useState('asc');
  const [chapterFilter, setChapterFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [chapters, setChapters] = useState({});
  const [topics, setTopics] = useState({});
  const [volunteers, setVolunteers] = useState({});
  
  // Hardcoded data
  const hardcodedChapters = {
    1: { chapter_id: 1, name: "Algebra Basics", subject: "Mathematics" },
    2: { chapter_id: 2, name: "Newton's Laws", subject: "Physics" },
    3: { chapter_id: 3, name: "Cell Biology", subject: "Biology" },
    4: { chapter_id: 4, name: "Chemical Bonding", subject: "Chemistry" },
    5: { chapter_id: 5, name: "Linear Equations", subject: "Mathematics" }
  };
  
  const hardcodedTopics = {
    1: { topic_id: 1, name: "Variables and Constants" },
    2: { topic_id: 2, name: "Solving Equations" },
    3: { topic_id: 3, name: "Force and Motion" },
    4: { topic_id: 4, name: "Action and Reaction" },
    5: { topic_id: 5, name: "Cell Membrane" },
    6: { topic_id: 6, name: "Mitochondria" },
    7: { topic_id: 7, name: "Covalent Bonds" },
    8: { topic_id: 8, name: "Ionic Bonds" },
    9: { topic_id: 9, name: "Slope-Intercept Form" },
    10: { topic_id: 10, name: "Graphing Lines" }
  };
  
  const hardcodedVolunteers = {
    1: { volunteer_id: 1, name: "Jane Smith" },
    2: { volunteer_id: 2, name: "John Doe" },
    3: { volunteer_id: 3, name: "Alice Johnson" }
  };
  
  // Generate random dates for the slots
  const generateRandomDate = (daysOffset) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString();
  };
  
  const hardcodedSlots = [
    {
      slot_id: 1,
      chapter_id: 1,
      topics_covered: [1, 2],
      language: "English",
      date: generateRandomDate(1),
      duration: 45,
      assignedOrNot: "unassigned",
      volunteer_id: null,
      is_urgent: true,
      notes: ""
    },
    {
      slot_id: 2,
      chapter_id: 2,
      topics_covered: [3, 4],
      language: "Spanish",
      date: generateRandomDate(-1),
      duration: 30,
      assignedOrNot: "assigned",
      volunteer_id: 1,
      is_urgent: false,
      notes: "Student needs help with understanding the second law"
    },
    {
      slot_id: 3,
      chapter_id: 3,
      topics_covered: [5, 6],
      language: "English",
      date: generateRandomDate(2),
      duration: 60,
      assignedOrNot: "unassigned",
      volunteer_id: null,
      is_urgent: false,
      notes: ""
    },
    {
      slot_id: 4,
      chapter_id: 4,
      topics_covered: [7, 8],
      language: "French",
      date: generateRandomDate(0),
      duration: 45,
      assignedOrNot: "unassigned",
      volunteer_id: null,
      is_urgent: true,
      notes: ""
    },
    {
      slot_id: 5,
      chapter_id: 5,
      topics_covered: [9, 10],
      language: "English",
      date: generateRandomDate(3),
      duration: 30,
      assignedOrNot: "assigned",
      volunteer_id: 1,
      is_urgent: false,
      notes: "Student struggles with graphing concepts"
    },
    {
      slot_id: 6,
      chapter_id: 1,
      topics_covered: [1, 2],
      language: "German",
      date: generateRandomDate(1),
      duration: 45,
      assignedOrNot: "unassigned",
      volunteer_id: null,
      is_urgent: false,
      notes: ""
    }
  ];

  // Fetch data on component mount (now just setting hardcoded data)
  useEffect(() => {
    fetchRelevantSlots();
    fetchChapters();
    fetchTopics();
    fetchVolunteers();
  }, []);

  // Set hardcoded chapters data
  const fetchChapters = () => {
    setChapters(hardcodedChapters);
  };

  // Set hardcoded topics data
  const fetchTopics = () => {
    setTopics(hardcodedTopics);
  };

  // Set hardcoded volunteers data
  const fetchVolunteers = () => {
    setVolunteers(hardcodedVolunteers);
  };

  // Set hardcoded slots with a slight delay to simulate loading
  const fetchRelevantSlots = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSlots(hardcodedSlots);
      setIsLoading(false);
    }, 800); // Simulate network delay
  };

  const handleConductSession = (slot) => {
    setCurrentSlot(slot);
    setIsInCall(true);
  };

  const handleAssignToSelf = (slotId) => {
    // Update local state directly since we're not making API calls
    setSlots(prev => 
      prev.map(slot => 
        slot.slot_id === slotId 
          ? {...slot, assignedOrNot: "assigned", volunteer_id: currentTeacherId} 
          : slot
      )
    );
  };

  // Handle note update without API call
  const handleUpdateNotes = (slotId, previousNotes = '') => {
    const newNotes = prompt("Enter session notes:", previousNotes);
    if (newNotes === null) return; // User cancelled
    
    // Update local state directly
    setSlots(prev => 
      prev.map(slot => 
        slot.slot_id === slotId ? {...slot, notes: newNotes} : slot
      )
    );
  };

  // Get unique languages for filter dropdown
  const uniqueLanguages = [...new Set(slots.map(slot => slot.language))];
  
  // Get unique chapters for filter dropdown
  const uniqueChapters = [...new Set(slots.map(slot => slot.chapter_id))];

  // Filter and sort slots based on active tab and filters
  const filterAndSortSlots = (slotsToFilter, assignmentStatus) => {
    // First filter by assignment status
    let filtered = slotsToFilter.filter(slot => {
      if (assignmentStatus === 'unassigned') {
        return slot.assignedOrNot === 'unassigned';
      } else {
        // For assigned slots, only show the ones assigned to the current teacher
        return slot.assignedOrNot === 'assigned' && slot.volunteer_id === currentTeacherId;
      }
    });
    
    // Apply language filter
    if (languageFilter !== 'all') {
      filtered = filtered.filter(slot => slot.language === languageFilter);
    }
    
    // Apply chapter filter
    if (chapterFilter !== 'all') {
      filtered = filtered.filter(slot => slot.chapter_id === parseInt(chapterFilter));
    }
    
    // Apply urgency filter
    if (urgencyFilter !== 'all') {
      filtered = filtered.filter(slot => 
        urgencyFilter === 'urgent' ? slot.is_urgent : !slot.is_urgent
      );
    }
    
    // Apply search query filter (search by chapter name or topics)
    if (searchQuery) {
      filtered = filtered.filter(slot => {
        const chapterName = chapters[slot.chapter_id]?.name?.toLowerCase() || '';
        const topicNames = slot.topics_covered
          .map(id => topics[id]?.name?.toLowerCase() || '')
          .join(' ');
        
        return chapterName.includes(searchQuery.toLowerCase()) || 
               topicNames.includes(searchQuery.toLowerCase());
      });
    }
    
    // Sort by date
    return filtered.sort((a, b) => {
      const dateA = parseISO(a.date);
      const dateB = parseISO(b.date);
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };

  // Update filtered slots when filters or data changes
  useEffect(() => {
    setFilteredSlots(filterAndSortSlots(slots, activeTab));
  }, [searchQuery, languageFilter, chapterFilter, urgencyFilter, sortDirection, slots, activeTab]);
  
  // Toggle sort direction
  const toggleSort = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  // Countdown timer calculation
  const getCountdown = (dateString) => {
    const slotDate = parseISO(dateString);
    const now = new Date();
    if (isBefore(slotDate, now)) return "Live now";
    return formatDistance(slotDate, now, { addSuffix: true });
  };

  // Helper to get topic names from IDs
  const getTopicNames = (topicIds) => {
    return topicIds.map(id => topics[id]?.name || `Topic ${id}`);
  };

  // Helper to get volunteer name from ID
  const getVolunteerName = (volunteerId) => {
    return volunteerId ? volunteers[volunteerId]?.name || `Volunteer ${volunteerId}` : "Unassigned";
  };

  // Get chapter name from ID
  const getChapterName = (chapterId) => {
    return chapters[chapterId]?.name || `Chapter ${chapterId}`;
  };

  // Get subject from chapter ID
  const getSubjectFromChapter = (chapterId) => {
    return chapters[chapterId]?.subject || "Subject Unknown";
  };

  return (
    <>
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-50 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Session Slot Management</h1>
        <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
          Logged in as: {getVolunteerName(currentTeacherId)}
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('unassigned')}
          className={`py-2 px-4 font-medium text-sm transition-colors duration-200 ${
            activeTab === 'unassigned' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Unassigned Slots
        </button>
        <button 
          onClick={() => setActiveTab('assigned')}
          className={`py-2 px-4 font-medium text-sm transition-colors duration-200 ${
            activeTab === 'assigned' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          My Assigned Slots
        </button>
      </div>
      
      {/* Common Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <input 
            type="text" 
            placeholder="Search by chapter or topic..." 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <select 
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
        >
          <option value="all">All Languages</option>
          {uniqueLanguages.map(language => (
            <option key={language} value={language}>{language}</option>
          ))}
        </select>
        
        <select 
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={chapterFilter}
          onChange={(e) => setChapterFilter(e.target.value)}
        >
          <option value="all">All Chapters</option>
          {uniqueChapters.map(chapterId => (
            <option key={chapterId} value={chapterId}>{getChapterName(chapterId)}</option>
          ))}
        </select>
        
        <select 
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={urgencyFilter}
          onChange={(e) => setUrgencyFilter(e.target.value)}
        >
          <option value="all">All Priority</option>
          <option value="urgent">Urgent Only</option>
          <option value="normal">Normal Only</option>
        </select>
        
        <button 
          onClick={toggleSort}
          className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
        >
          Date {sortDirection === 'asc' ? '↑' : '↓'}
        </button>
      </div>
      
      {/* Loading indicator */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        /* Slot List */
        <div className="animate-fadeIn">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              {activeTab === 'unassigned' ? 'Unassigned Slots' : 'My Assigned Slots'}
            </h2>
          </div>
          
          {filteredSlots.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">
                No {activeTab === 'unassigned' ? 'unassigned' : 'assigned'} slots found with the current filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredSlots.map(slot => (
                <div key={slot.slot_id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  {/* Urgency indicator */}
                  {slot.is_urgent && (
                    <div className="flex items-center mb-2">
                      <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
                      <span className="text-sm font-medium text-red-500">URGENT</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{getChapterName(slot.chapter_id)}</h3>
                      <div className="mt-1 text-sm text-gray-600 flex flex-wrap gap-2">
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          {getSubjectFromChapter(slot.chapter_id)}
                        </span>
                        <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          {slot.language}
                        </span>
                      </div>
                    </div>
                    
                    <span className={`text-xs font-medium px-2 py-1 rounded-full h-fit ${
                      slot.assignedOrNot === 'assigned' 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {slot.assignedOrNot === 'assigned' 
                        ? 'Assigned to me' 
                        : 'Unassigned'}
                    </span>
                  </div>
                  
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700">Topics Covered:</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {getTopicNames(slot.topics_covered).map((topic, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-600">
                    <div className="flex items-center mb-1">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {format(parseISO(slot.date), 'MMM d, yyyy • h:mm a')} ({slot.duration} mins)
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                      {getCountdown(slot.date)}
                    </span>
                    
                    {activeTab === 'unassigned' ? (
                      <button 
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                        onClick={() => handleAssignToSelf(slot.slot_id)}
                      >
                        Assign to Me
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                          onClick={() => handleConductSession(slot)}
                        >
                          Conduct Session
                        </button>
                        <button 
                          className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors text-sm"
                          onClick={() => handleUpdateNotes(slot.slot_id, slot.notes)}
                        >
                          Notes
                        </button>
                      </div>
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
          <div className="absolute top-5 left-8 z-10 text-white">
            <h3 className="font-bold text-xl">{getChapterName(currentSlot?.chapter_id)}</h3>
            <p className="text-sm opacity-80">
              {getSubjectFromChapter(currentSlot?.chapter_id)} - {currentSlot?.language}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {currentSlot?.topics_covered.map((topicId, index) => (
                <span key={index} className="bg-white bg-opacity-20 text-white px-2 py-0.5 rounded-full text-xs">
                  {topics[topicId]?.name || `Topic ${topicId}`}
                </span>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => setIsInCall(false)}
            className="absolute top-5 right-8 z-10 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
            aria-label="End session"
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

export default Matching;