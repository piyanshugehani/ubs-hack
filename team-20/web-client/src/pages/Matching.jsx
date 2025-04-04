import React, { useState, useEffect } from 'react';
import { format, formatDistance, isBefore, parseISO } from 'date-fns';
import Video from './Video';
import axios from 'axios';

const Matching = () => {
  const currentTeacherId = 1;
  const [activeTab, setActiveTab] = useState('unassigned');
  const [slots, setSlots] = useState([]);
  const [isInCall, setIsInCall] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(null);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [sortDirection, setSortDirection] = useState('desc');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  async function getSlots() {
    const url = 'http://localhost:5000/recommend_slots?volunteer_id=2';
    try {
      const response = await axios.get(url);
      const processedSlots = response.data.recommended_slots.map((slot, index) => ({
        slot_id: index + 1,
        chapter_title: slot.chapter_title,
        subject: slot.subject,
        language: slot.language,
        matchScore: slot.matchScore,
        matchReason: slot.matchReason,
        schedule: slot.schedule,
        assignedOrNot: "unassigned"
      }));
      setSlots(processedSlots);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await getSlots();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleConductSession = (slot) => {
    setCurrentSlot(slot);
    setIsInCall(true);
  };

  const handleAssignToSelf = (slotId) => {
    setSlots(prev => 
      prev.map(slot => 
        slot.slot_id === slotId 
          ? {...slot, assignedOrNot: "assigned"} 
          : slot
      )
    );
  };

  const filterAndSortSlots = (slotsToFilter, assignmentStatus) => {
    let filtered = slotsToFilter.filter(slot => {
      if (assignmentStatus === 'unassigned') {
        return slot.assignedOrNot === 'unassigned';
      }
      return slot.assignedOrNot === 'assigned';
    });

    if (languageFilter !== 'all') {
      filtered = filtered.filter(slot => slot.language === languageFilter);
    }

    if (subjectFilter !== 'all') {
      filtered = filtered.filter(slot => slot.subject === subjectFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(slot => 
        slot.chapter_title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        slot.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
    
      if (sortDirection === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  };

  useEffect(() => {
    setFilteredSlots(filterAndSortSlots(slots, activeTab));
  }, [searchQuery, languageFilter, subjectFilter, sortDirection, slots, activeTab]);

  const toggleSort = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const getCountdown = (schedule) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayIndex = daysOfWeek.indexOf(schedule.day);
    const today = new Date();
    const currentDayIndex = today.getDay();
    let daysToAdd = dayIndex - currentDayIndex;
    if (daysToAdd < 0) daysToAdd += 7;
    
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    date.setHours(9 + Math.floor(Math.random() * 9), 0, 0, 0);
    
    if (isBefore(date, today)) return "Live now";
    return formatDistance(date, today, { addSuffix: true });
  };

  const uniqueLanguages = [...new Set(slots.map(slot => slot.language))];
  const uniqueSubjects = [...new Set(slots.map(slot => slot.subject))];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-50 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Matching Dashboard</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('unassigned')}
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'unassigned' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
          }`}
        >
          Available Matches
        </button>
        <button 
          onClick={() => setActiveTab('assigned')}
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'assigned' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
          }`}
        >
          My Scheduled Sessions
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Search chapters..." 
          className="flex-grow p-2 border rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <select 
          className="p-2 border rounded-md"
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
        >
          <option value="all">All Languages</option>
          {uniqueLanguages.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>

        <select 
          className="p-2 border rounded-md"
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
        >
          <option value="all">All Subjects</option>
          {uniqueSubjects.map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>

        <button 
          onClick={toggleSort}
          className="p-2 bg-gray-100 rounded-md"
        >
          Date {sortDirection === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 px-4 py-6">
  {filteredSlots.map(slot => (
    <div key={slot.slot_id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg mb-1">{slot.chapter_title}</h3>
          <p className="text-sm text-gray-600">{slot.subject}</p>
        </div>
        {/* <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {slot.matchScore}%
        </span> */}
      </div>

      <div className="mt-3 mb-4">
        <p className="text-sm text-gray-600 mb-3">{slot.matchReason}</p>
        <div className="flex items-center mt-2 text-sm">
          <span className="mr-3">📅 {slot.schedule.day} {slot.schedule.time}</span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            {getCountdown(slot.schedule)}
          </span>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        {activeTab === 'unassigned' ? (
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md transition-colors"
            onClick={() => handleAssignToSelf(slot.slot_id)}
          >
            Accept
          </button>
        ) : (
          <button 
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md transition-colors"
            onClick={() => handleConductSession(slot)}
          >
            Start Session
          </button>
        )}
      </div>
    </div>
  ))}
</div>

      )}

      {isInCall && currentSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">{currentSlot.chapter_title}</h2>
              <button 
                onClick={() => setIsInCall(false)}
                className="text-red-500 hover:text-red-700"
              >
                Close
              </button>
            </div>
            <Video />
          </div>
        </div>
      )}
    </div>
  );
};

export default Matching;
