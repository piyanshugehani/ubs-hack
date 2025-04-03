import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import VolunteerLayout from "./layouts/VolunteerLayout";
import SchoolLayout from "./layouts/SchoolLayout";
import StudentLayout from "./layouts/StudentLayout";
import SchoolDashboard from "./pages/SchoolDashboard";
import Sessions from "./pages/Sessions";
import SessionDetails from "./pages/SessionDetails";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
// import LMSIntegration from "./pages/LMSIntegration";
import ManageVolunteers from "./pages/ManageVolunteers";
import ManageSessions from "./pages/ManageSessions";
import Analytics from "./pages/Analytics";
import StudentClasses from "./pages/StudentClasses";
import LiveSession from "./pages/LiveSession";
import Notes from "./pages/Notes";
import Feedback from "./pages/Feedback";
import StudentDashboard from "./pages/StudentDashboard";
import SyllabusUpload from "./pages/upload/Upload";
import Dashboard from "./pages/Dashboard";

function AppWrapper() {
  const location = useLocation();
  const isSchoolPath = location.pathname.startsWith("/school");
  const isStudentPath = location.pathname.startsWith("/student");

  return (
    <>
      {isSchoolPath ? (
        <SchoolLayout>
          <Routes>
            <Route path="/school" element={<SchoolDashboard />} />
            <Route path="/school/upload" element={<SyllabusUpload />} />
            <Route path="/school/volunteers" element={<ManageVolunteers />} />
            <Route path="/school/sessions" element={<ManageSessions />} />
            <Route path="/school/sessions/:id" element={<SessionDetails />} />
            <Route path="/school/analytics" element={<Analytics />} />
            <Route path="/school/settings" element={<Settings />} />
          </Routes>
        </SchoolLayout>
      ) : isStudentPath ? (
        <StudentLayout>
          <Routes>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/classes" element={<StudentClasses />} />
            <Route path="/student/live" element={<LiveSession />} />
            <Route path="/student/notes" element={<Notes />} />
            <Route path="/student/feedback" element={<Feedback />} />
          </Routes>
        </StudentLayout>
      ) : (
        <VolunteerLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/sessions/:id" element={<SessionDetails />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </VolunteerLayout>
      )}
    </>
  );
}

function App() {
  return (
    <>
      <AppWrapper />
    </>
  );
}

export default App;
