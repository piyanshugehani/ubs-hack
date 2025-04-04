# Gyan Sarthi
![image](https://github.com/user-attachments/assets/68037fcb-8cf3-48d2-90fa-5ffd0feb5b69)
![image](https://github.com/user-attachments/assets/39d41715-3a1c-421a-8908-d0e55cbebb57)
![image](https://github.com/user-attachments/assets/7591725b-fdc7-406e-8b74-3bb9835ef793)
![image](https://github.com/user-attachments/assets/cda5ca1f-126a-4d0c-8b63-0703959b619d)
![image](https://github.com/user-attachments/assets/8bde34e3-cb75-4145-a665-b8e246eefe66)
![image](https://github.com/user-attachments/assets/a435e1e4-1dbf-493e-9408-548329109118)
## Overview

This education platform is a comprehensive solution designed to bridge the gap between volunteers, students, and schools through technology-enabled learning experiences. The platform integrates live teaching capabilities, automated content generation, and data-driven insights to create an effective educational ecosystem.

Based on the system architecture diagram, the platform facilitates real-time communication, session recording and processing, authentication for different user types, and detailed analytics to monitor performance and progress.

## Architecture Components

### Communication Services

The communication module forms the backbone of the platform, enabling real-time interaction between volunteers and students:

- **Live Whiteboard**: Interactive digital canvas for drawing diagrams, solving problems, and visualizing concepts during teaching sessions
- **Video Conferencing**: Real-time video communication system that supports:
  - **Live Sessions**: Direct interaction between volunteers and students
  - **Join Sessions**: Ability for students to enter ongoing teaching sessions
  - **Record Sessions**: Capability to record sessions for later review

- **Recorded Video Processing**: Automatic processing of recorded sessions to generate:
  - **Transcripts**: Text versions of the spoken content
  - **Notes**: Structured learning materials extracted from the session content

### Authentication Services

Multi-tiered authentication system ensuring appropriate access for different user types:

- **Student Authentication**: Secure access for learners with student-specific permissions
- **Volunteer Authentication**: Identity verification and access control for teaching volunteers
- **School Authentication**: Administrative access for educational institutions

### User Interfaces

Tailored dashboards for each user category:

- **Volunteer Dashboard**: Tools for managing teaching sessions, reviewing student progress, and accessing teaching resources
- **Student Dashboard**: Interface for accessing live and recorded sessions, notes, and learning materials
- **School Dashboard**: Administrative panel for monitoring overall program effectiveness and student participation

### AI Services

Intelligent systems that enhance teaching effectiveness and learner outcomes:

- **Feedback Engine**: AI-powered system that analyzes student work and provides constructive feedback
- **Matching Algorithm**: Intelligent pairing system that connects students with compatible volunteer teachers based on subject needs, teaching styles, and availability

### Analytics and Database

Data infrastructure for storing and analyzing platform usage:

- **MongoDB**: NoSQL database storing user profiles, session data, learning materials, and interaction records
- **Performance Analytics**: Tools for measuring and visualizing student progress, volunteer effectiveness, and overall platform usage
- **Performance Monitoring**: Real-time tracking of system performance metrics

### Integration Layer

- **Telegram Bot**: External communication channel providing notifications, reminders, and basic platform access via Telegram messenger
- **Information Requests**: System for handling user queries and data access needs
- **Feedback and Quizzes**: Mechanisms for collecting user input and assessing student knowledge
- **Mentor Recommendations**: Suggestion system for optimal volunteer-student pairings

## User Workflows

### Volunteer Journey
1. Authentication through the Volunteer Auth system
2. Access to the Volunteer Dashboard interface
3. Conducting live teaching sessions via Whiteboard and Video Conferencing tools
4. Receiving performance metrics and student progress data
5. Providing feedback through the AI-assisted Feedback Engine

### Student Journey
1. Authentication through the Student Auth system
2. Access to the Student Dashboard interface
3. Joining live sessions or watching recorded videos
4. Receiving automatically generated notes and transcripts
5. Participating in quizzes and receiving personalized feedback
6. Requesting information as needed

### School Administration Journey
1. Authentication through the School Auth system
2. Access to the School Dashboard interface
3. Monitoring student participation and progress
4. Reviewing volunteer effectiveness and engagement
5. Accessing performance analytics for data-driven decision making

## Technical Implementation

### Backend Stack
- **Database**: MongoDB for flexible document storage
- **Server-side Logic**: Likely Node.js/Express (based on communication flow design)
- **AI Components**: Python-based services for transcript generation, matching algorithms, and feedback systems

### Frontend Considerations
- **Dashboard Interfaces**: Web-based UIs for students, volunteers, and schools
- **Interactive Components**: Real-time collaboration tools integrated with video conferencing
- **Responsive Design**: Access across devices of various screen sizes

### Deployment Options
- **Cloud-based**: Scalable architecture supporting concurrent video sessions
- **Microservices**: Modular design allowing independent scaling of different components
- **Content Delivery Network**: Optimized delivery of recorded videos and educational content

## Getting Started

### Prerequisites
- Node.js environment
- MongoDB installation
- Python environment for AI components
- Video conferencing integration capabilities

### Installation (Conceptual)
1. Clone the repository from your version control system
2. Install backend dependencies (`npm install` or equivalent)
3. Set up MongoDB database and connection parameters
4. Configure authentication providers
5. Install Python dependencies for AI services
6. Set up environment variables for service connections

### Configuration
- Database connection strings
- Authentication provider credentials
- Video conferencing service API keys
- Storage configuration for recorded sessions
- AI service endpoints

## Repository Structure (Proposed)

```
education-platform/
├── backend/
│   ├── api/                  # API endpoints
│   ├── auth/                 # Authentication services
│   ├── services/             # Business logic services
│   └── models/               # Data models
├── ai-services/
│   ├── transcript-generator/ # Speech-to-text processing
│   ├── notes-generator/      # Automated notes creation
│   ├── feedback-engine/      # AI feedback system
│   └── matching-algorithm/   # Volunteer-student matching
├── frontend/
│   ├── common/               # Shared components
│   ├── volunteer-dashboard/  # Volunteer UI
│   ├── student-dashboard/    # Student UI
│   └── school-dashboard/     # School administration UI
├── infrastructure/
│   ├── docker/               # Containerization
│   └── deployment/           # Deployment scripts
└── docs/                     # Documentation
```

### Project Drive
https://drive.google.com/drive/folders/12zc2r-qs5946GXSx4xE2uGaZbSzCHA9b?usp=drive_link

## Future Enhancements

Potential areas for expansion based on the existing architecture:

- **Mobile Applications**: Native apps for improved mobile experience
- **Offline Mode**: Support for areas with limited connectivity
- **Content Library**: Structured repository of teaching materials
- **Gamification**: Achievement systems to increase engagement
- **Advanced Analytics**: Predictive models for student success
- **Integration with LMS**: Compatibility with existing school systems
- **Accessibility Features**: Support for learners with different needs

## Contributing

Guidelines for contributing to the project's development:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request with detailed description
4. Follow the code style and testing requirements

---
