import React, { useState } from 'react';
import { Calendar, Clock, FileText, Image, PlayCircle, BarChart2, Heart, Brain, ChevronRight, X } from 'lucide-react';
import VideoUrl from '../../public/assets/File.mp4';

const PastSessions = () => {
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [notesOption, setNotesOption] = useState('transcript');
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');

  // Sample data for past sessions
  const pastSessions = [
    {
      id: 1,
      title: 'Mathematics - Algebra Basics',
      date: '2025-03-28',
      duration: '45 minutes',
      thumbnail: '/api/placeholder/400/225',
      videoUrl: VideoUrl,
      students: 12,
      sentiment: {
        engagement: 85,
        comprehension: 78,
        satisfaction: 92,
        attention: 81,
        interactions: [
          { timestamp: '00:05:23', type: 'question', sentiment: 'confusion' },
          { timestamp: '00:12:47', type: 'answer', sentiment: 'understanding' },
          { timestamp: '00:28:12', type: 'discussion', sentiment: 'enthusiasm' }
        ]
      }
    },
    {
      id: 2,
      title: 'Science - Introduction to Physics',
      date: '2025-03-25',
      duration: '60 minutes',
      thumbnail: '/api/placeholder/400/225',
      videoUrl: VideoUrl,
      students: 15,
      sentiment: {
        engagement: 92,
        comprehension: 73,
        satisfaction: 88,
        attention: 86,
        interactions: [
          { timestamp: '00:08:15', type: 'question', sentiment: 'curiosity' },
          { timestamp: '00:22:33', type: 'answer', sentiment: 'understanding' },
          { timestamp: '00:35:08', type: 'discussion', sentiment: 'excitement' }
        ]
      }
    },
    {
      id: 3,
      title: 'English Literature - Poetry Analysis',
      date: '2025-03-20',
      duration: '50 minutes',
      thumbnail: '/api/placeholder/400/225',
      videoUrl: VideoUrl,
      students: 10,
      sentiment: {
        engagement: 79,
        comprehension: 85,
        satisfaction: 91,
        attention: 78,
        interactions: [
          { timestamp: '00:03:45', type: 'question', sentiment: 'interest' },
          { timestamp: '00:18:22', type: 'answer', sentiment: 'thoughtfulness' },
          { timestamp: '00:31:16', type: 'discussion', sentiment: 'creativity' }
        ]
      }
    },
    {
      id: 4,
      title: 'History - World War II Overview',
      date: '2025-03-15',
      duration: '55 minutes',
      thumbnail: '/api/placeholder/400/225',
      videoUrl:VideoUrl,
      students: 18,
      sentiment: {
        engagement: 94,
        comprehension: 82,
        satisfaction: 89,
        attention: 88,
        interactions: [
          { timestamp: '00:07:33', type: 'question', sentiment: 'curiosity' },
          { timestamp: '00:21:09', type: 'answer', sentiment: 'understanding' },
          { timestamp: '00:42:51', type: 'discussion', sentiment: 'reflection' }
        ]
      }
    }
  ];

  const getSentimentColor = (value) => {
    if (value >= 90) return 'bg-emerald-500';
    if (value >= 80) return 'bg-green-500';
    if (value >= 70) return 'bg-yellow-500';
    if (value >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case 'confusion': return '😕';
      case 'understanding': return '😊';
      case 'enthusiasm': return '😃';
      case 'curiosity': return '🤔';
      case 'excitement': return '😄';
      case 'interest': return '🧐';
      case 'thoughtfulness': return '🤓';
      case 'creativity': return '🎨';
      case 'reflection': return '🤔';
      default: return '😐';
    }
  };

  const openModal = (session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
    setNotes('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  const openVideoModal = (session, e) => {
    e.preventDefault();
    setSelectedSession(session);
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
  };
const generateNotes = async () => {
    console.log("Generating notes...");
    
    setLoading(true);
    setNotes(""); // Clear previous notes

    try {
        if (notesOption === 'transcript') {
            // Dummy transcript notes generation
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
            const dummyTranscriptNotes = `
Session Transcript Notes:

00:00 - Introduction to the topic
- Welcome and overview of today's session
- Brief recap of previous concepts

05:00 - Main Concept Discussion
- Detailed explanation of key principles
- Examples and illustrations
- Student questions and clarifications

15:00 - Interactive Exercise
- Group discussion
- Problem-solving activities
- Real-world applications

30:00 - Summary and Conclusion
- Key takeaways
- Assignment instructions
- Preview of next session

Additional Notes:
- High student engagement during interactive segments
- Several clarifying questions about core concepts
- Successful completion of group exercises
`;
            setNotes(dummyTranscriptNotes);
        } else {
            // For screenshots option, trigger PDF download
            const pdfUrl = '/sample-notes.pdf'; // Replace with your actual PDF path
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'session-notes.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setNotes("PDF notes have been downloaded to your device.");
        }
    } catch (error) {
        console.error("Error generating notes:", error);
        setNotes(`Error: ${error.message}`);
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Past Sessions</h1>
          <p className="text-gray-500">Review your recorded sessions and create notes for future reference</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastSessions.map((session) => (
            <div key={session.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-md group">
              <div className="relative">
                {/* <img 
                  src={session.thumbnail} 
                  alt={session.title} 
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" 
                /> */}
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={(e) => openVideoModal(session, e)}
                    className="bg-primary rounded-full p-3 text-white shadow-lg transform transition-transform duration-300 hover:scale-110"
                  >
                    <PlayCircle className="w-8 h-8" />
                  </button>
                </div>
                <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white px-3 py-1 text-sm rounded-tl-md">
                  {session.duration}
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">{session.title}</h3>
                
                <div className="flex items-center justify-between text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                    <span className="text-sm">{session.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-1 text-gray-500" />
                    <span className="text-sm">{session.students} students</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Student Engagement</p>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${getSentimentColor(session.sentiment.engagement)}`} style={{ width: `${session.sentiment.engagement}%` }}></div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-4">
                  <a 
                    href={session.videoUrl} 
                    onClick={(e) => openVideoModal(session, e)}
                    className="text-primary hover:text-blue-700 font-medium text-sm flex items-center"
                  >
                    <PlayCircle className="w-4 h-4 mr-1" />
                    Watch Recording
                  </a>
                  <button 
                    onClick={() => openModal(session)}
                    className="bg-primary hover:bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center"
                  >
                    Prepare Notes
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes Preparation Modal */}
      {isModalOpen && selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-screen overflow-hidden flex flex-col animate-fadeIn">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Prepare Notes: {selectedSession.title}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 bg-gray-100 p-2 rounded-full transition-colors duration-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
              {/* Left sidebar - Video and session info */}
              <div className="w-full md:w-1/2 p-6 overflow-y-auto">
                <div className="bg-gray-900 aspect-video mb-6 rounded-xl overflow-hidden shadow-md">
                  <iframe 
                    src={selectedSession.videoUrl} 
                    className="w-full h-full" 
                    title={selectedSession.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                
                <div className="mb-6 bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-medium text-gray-800 mb-3">Session Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{selectedSession.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{selectedSession.duration}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Heart className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{selectedSession.students} students attended</span>
                    </div>
                  </div>
                </div>
                
                {/* AI Sentiment Analysis */}
                <div className="bg-gray-50 p-4 rounded-xl mb-6">
                  <div className="flex items-center mb-3">
                    <Brain className="w-5 h-5 mr-2 text-primary" />
                    <h3 className="font-medium text-gray-800">AI Sentiment Insights</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Engagement</p>
                      <div className="flex items-center">
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                          <div className={`h-full ${getSentimentColor(selectedSession.sentiment.engagement)}`} style={{ width: `${selectedSession.sentiment.engagement}%` }}></div>
                        </div>
                        <span className="text-sm font-medium">{selectedSession.sentiment.engagement}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Comprehension</p>
                      <div className="flex items-center">
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                          <div className={`h-full ${getSentimentColor(selectedSession.sentiment.comprehension)}`} style={{ width: `${selectedSession.sentiment.comprehension}%` }}></div>
                        </div>
                        <span className="text-sm font-medium">{selectedSession.sentiment.comprehension}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Satisfaction</p>
                      <div className="flex items-center">
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                          <div className={`h-full ${getSentimentColor(selectedSession.sentiment.satisfaction)}`} style={{ width: `${selectedSession.sentiment.satisfaction}%` }}></div>
                        </div>
                        <span className="text-sm font-medium">{selectedSession.sentiment.satisfaction}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Attention</p>
                      <div className="flex items-center">
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                          <div className={`h-full ${getSentimentColor(selectedSession.sentiment.attention)}`} style={{ width: `${selectedSession.sentiment.attention}%` }}></div>
                        </div>
                        <span className="text-sm font-medium">{selectedSession.sentiment.attention}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Key Moments</h4>
                  <div className="space-y-2">
                    {selectedSession.sentiment.interactions.map((interaction, index) => (
                      <div key={index} className="flex items-center p-2 bg-white rounded-lg border border-gray-100">
                        <div className="text-xl mr-2">{getSentimentEmoji(interaction.sentiment)}</div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{interaction.type}</span>
                            <span className="text-xs text-gray-500">{interaction.timestamp}</span>
                          </div>
                          <p className="text-xs text-gray-600 capitalize">{interaction.sentiment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Notes Preparation Method</h3>
                  <div className="flex space-x-3 mb-4">
                    <button
                      className={`flex items-center px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                        notesOption === 'transcript' 
                          ? 'bg-primary text-white shadow-md' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setNotesOption('transcript')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      From Transcript
                    </button>
                    <button
                      className={`flex items-center px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                        notesOption === 'screenshots' 
                          ? 'bg-primary text-white shadow-md' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setNotesOption('screenshots')}
                    >
                      <Image className="w-4 h-4 mr-2" />
                      From Screenshots
                    </button>
                  </div>
                  
                  <button
                    className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                      loading 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-black hover:bg-gray-800 text-white shadow-md hover:shadow-lg'
                    }`}
                    onClick={generateNotes}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span>Generating...</span>
                      </div>
                    ) : (
                      `Generate Notes with ${notesOption === 'transcript' ? 'Transcript' : 'Screenshots'}`
                    )}
                  </button>
                </div>
              </div>
              
              {/* Notes section */}
              <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l border-gray-200 p-6 overflow-y-auto bg-gray-50">
                <div className="flex items-center mb-4">
                  <FileText className="w-5 h-5 mr-2 text-primary" />
                  <h3 className="font-medium text-gray-800">Notes Editor</h3>
                </div>
                
                {notes ? (
                  <div className="mb-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm whitespace-pre-wrap min-h-64">
                      {notes}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-200 mb-6">
                    {loading ? (
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600">Analyzing session and generating notes...</p>
                        <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <FileText className="w-12 h-12 text-gray-300 mb-4" />
                        <p>Select a method and click generate to create notes</p>
                        <p className="text-sm text-gray-400 mt-2">AI will analyze the session content</p>
                      </div>
                    )}
                  </div>
                )}
                
                {notes && (
                  <div className="flex space-x-4">
                    <button className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm">
                      Edit Notes
                    </button>
                    <button className="flex-1 bg-primary hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg">
                      Save Notes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {isVideoModalOpen && selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-scaleIn">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-bold text-gray-800">{selectedSession.title}</h2>
              <button onClick={closeVideoModal} className="text-gray-500 hover:text-gray-700 bg-gray-100 p-2 rounded-full transition-colors duration-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="aspect-video bg-black">
              <iframe 
                src={selectedSession.videoUrl} 
                className="w-full h-full" 
                title={selectedSession.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="p-4 bg-gray-50">
              <div className="flex items-center justify-between text-gray-600 text-sm">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                  <span>{selectedSession.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-gray-500" />
                  <span>{selectedSession.duration}</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-1 text-gray-500" />
                  <span>{selectedSession.students} students</span>
                </div>
                <div className="flex items-center">
                  <BarChart2 className="w-4 h-4 mr-1 text-gray-500" />
                  <span>{selectedSession.sentiment.engagement}% engagement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PastSessions;