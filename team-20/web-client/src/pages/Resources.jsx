import React, { useState } from 'react';
import { FaBook, FaComments, FaBullhorn, FaPlus, FaDownload, FaReply, FaUsers, FaNewspaper, FaGraduationCap, FaHandsHelping, FaCalendarAlt } from 'react-icons/fa';

const Resources = () => {
  const [activeTab, setActiveTab] = useState('materials');
  const [materials] = useState([
    { id: 1, title: 'Math Basics', subject: 'Mathematics', date: '2023-08-15', type: 'Notes' },
    { id: 2, title: 'History HW', subject: 'History', date: '2023-08-14', type: 'Assignment' },
  ]);

  const [forumPosts] = useState([
    { id: 1, title: 'Teaching Strategies', author: 'Sarah Johnson', replies: 5, date: '2h ago' },
    { id: 2, title: 'Classroom Management', author: 'Mike Chen', replies: 3, date: '5h ago' },
  ]);

  const [announcements] = useState([
    { id: 1, title: 'New Curriculum', content: 'Updated science curriculum available...', date: '2023-08-10' },
    { id: 2, title: 'Training Session', content: 'Mandatory training on Friday...', date: '2023-08-09' },
  ]);

  const [communityPosts] = useState([
    { id: 1, title: 'Teaching Tips for New Volunteers', author: 'Priya Singh', likes: 12, date: '1d ago' },
    { id: 2, title: 'My Experience with Online Teaching', author: 'John Doe', likes: 8, date: '2d ago' },
  ]);

  // New state for government schemes and resources news
  const [govSchemes] = useState([
    { 
      id: 1, 
      title: 'NCERT Launches Free E-Textbooks for All Classes',
      source: 'NCERT',
      category: 'Teaching Resources',
      date: '2 days ago',
      summary: 'Complete set of e-textbooks now available through ePathshala and NCERT website/app. Includes textbooks for Classes 1-12 in multiple languages.',
      link: 'https://ncert.nic.in'
    },
    { 
      id: 2, 
      title: 'ULLAS Program Volunteer Registration Open',
      source: 'Ministry of Education',
      category: 'Volunteer Opportunity',
      date: '1 week ago',
      summary: 'Volunteers needed for adult literacy program. Training and teaching materials provided in 22 languages including Marathi.',
      link: 'https://ullas.education.gov.in'
    },
    { 
      id: 3, 
      title: 'DIKSHA Platform Adds New Interactive Content',
      source: 'DIKSHA',
      category: 'Digital Resources',
      date: '3 days ago',
      summary: 'New curriculum-aligned materials added for Mathematics and Science. Available in Marathi, Hindi, and English.',
      link: 'https://diksha.gov.in'
    },
    { 
      id: 4, 
      title: 'CBSE Announces Free Training Workshops for Educators',
      source: 'CBSE Training Portal',
      category: 'Professional Development',
      date: '5 days ago',
      summary: 'Online workshops on NEP 2020 implementation open to all education volunteers. Certificates provided upon completion.',
      link: 'https://cbseit.in/cbse/training'
    },
    { 
      id: 5, 
      title: 'Maharashtra EdTech Grant Program Accepting Applications',
      source: 'SCERT Maharashtra',
      category: 'Funding Opportunity',
      date: '1 day ago',
      summary: 'Grants available for NGOs and volunteer groups implementing educational technology solutions in underserved communities.',
      link: 'http://www.mscert.org.in'
    },
    { 
      id: 6, 
      title: 'SCERT Maharashtra Updates Model Question Papers',
      source: 'MAA Portal',
      category: 'Teaching Resources',
      date: '4 days ago',
      summary: 'New model questions and answers for SSC and HSC exams now available. Includes practice materials for volunteers supporting exam preparation.',
      link: 'https://maa.ac.in'
    }
  ]);
  
  // State for selected category filter
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Categories for filtering
  const categories = ['All', 'Teaching Resources', 'Volunteer Opportunity', 'Digital Resources', 'Professional Development', 'Funding Opportunity'];
  
  // Filter schemes based on selected category
  const filteredSchemes = categoryFilter === 'All' 
    ? govSchemes 
    : govSchemes.filter(scheme => scheme.category === categoryFilter);

  // Function to get category icon
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Teaching Resources':
        return <FaBook className="text-blue-500" />;
      case 'Volunteer Opportunity':
        return <FaHandsHelping className="text-green-500" />;
      case 'Digital Resources':
        return <FaGraduationCap className="text-purple-500" />;
      case 'Professional Development':
        return <FaCalendarAlt className="text-orange-500" />;
      case 'Funding Opportunity':
        return <FaHandsHelping className="text-red-500" />;
      default:
        return <FaNewspaper className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Educational Resources</h1>
          
          {/* Navigation */}
          <div className="flex space-x-4 border-b border-gray-200 pb-2">
            <button
              onClick={() => setActiveTab('materials')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg ${
                activeTab === 'materials' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaBook />
              <span>Materials</span>
            </button>
            
            <button
              onClick={() => setActiveTab('forum')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg ${
                activeTab === 'forum' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaComments />
              <span>Volunteer Forum</span>
            </button>
            
            <button
              onClick={() => setActiveTab('community')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg ${
                activeTab === 'community' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaUsers />
              <span>Community</span>
            </button>
            
            <button
              onClick={() => setActiveTab('announcements')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg ${
                activeTab === 'announcements' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaBullhorn />
              <span>Announcements</span>
            </button>
          </div>
        </div>

        {/* Content Sections */}
        {activeTab === 'materials' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {materials.map((material) => (
              <div key={material.id} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{material.title}</h3>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <span>{material.subject}</span>
                      <span className="text-sm">{material.date}</span>
                    </div>
                  </div>
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                    {material.type}
                  </span>
                </div>
                <button className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg">
                  <FaDownload />
                  <span>Download File</span>
                </button>
              </div>
            ))}
            <button className="fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors">
              <FaPlus size={24} />
            </button>
          </div>
        )}

        {activeTab === 'forum' && (
          <div className="space-y-6">
            {forumPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg p-6 hover:bg-gray-50 transition-colors border border-gray-200">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{post.title}</h3>
                <div className="flex items-center space-x-4 text-gray-600 mb-4">
                  <span>By {post.author}</span>
                  <span className="flex items-center space-x-1">
                    <FaReply />
                    <span>{post.replies}</span>
                  </span>
                  <span>{post.date}</span>
                </div>
                <button className="text-primary hover:text-primary/90">
                  Join Discussion →
                </button>
              </div>
            ))}
            <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg flex items-center space-x-2">
              <FaPlus />
              <span>Start New Discussion</span>
            </button>
          </div>
        )}

        {activeTab === 'community' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Trending Government Schemes & Resources</h2>
              <p className="text-gray-600 mb-4">Stay updated with the latest educational resources and opportunities scraped from government websites.</p>
              
              {/* Category filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(category => (
                  <button 
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      categoryFilter === category 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              {/* Government schemes */}
              <div className="space-y-4">
                {filteredSchemes.map((scheme) => (
                  <div key={scheme.id} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {getCategoryIcon(scheme.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{scheme.title}</h3>
                          <span className="text-gray-500 text-sm">{scheme.date}</span>
                        </div>
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                            {scheme.category}
                          </span>
                          <span className="text-gray-600 text-sm">Source: {scheme.source}</span>
                        </div>
                        <p className="text-gray-700 mb-4">{scheme.summary}</p>
                        <a 
                          href={scheme.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/90 font-medium"
                        >
                          Learn More →
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <hr className="my-8 border-gray-200" />
            
            {/* Original community posts */}
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Community Posts</h2>
            <div className="space-y-6">
              {communityPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{post.title}</h3>
                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
                    <span>By {post.author}</span>
                    <span>❤️ {post.likes}</span>
                    <span>{post.date}</span>
                  </div>
                  <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg">
                    Read More
                  </button>
                </div>
              ))}
              <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg flex items-center space-x-2">
                <FaPlus />
                <span>Share Your Experience</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="space-y-6">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="bg-white rounded-lg p-6 border-l-4 border-primary">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{announcement.title}</h3>
                  <span className="text-gray-600 text-sm">{announcement.date}</span>
                </div>
                <p className="text-gray-700">{announcement.content}</p>
                <div className="mt-4">
                  <span className="bg-primary text-white px-2 py-1 rounded text-sm">
                    Admin Message
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;