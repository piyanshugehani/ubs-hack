import { Routes, Route, useLocation } from "react-router-dom";
import VolunteerLayout from "./layouts/VolunteerLayout";
import SchoolLayout from "./layouts/SchoolLayout";
import StudentLayout from "./layouts/StudentLayout";
import Dashboard from "./pages/Dashboard";
import Sessions from "./pages/Sessions";
import SessionDetails from "./pages/SessionDetails";
import Progress from "./pages/Progress";
import SchoolSettings from "./pages/SchoolSettings";
import StudentClasses from "./pages/StudentClasses";
import LiveSession from "./pages/LiveSession";
import Notes from "./pages/Notes";
import Feedback from "./pages/Feedback";
import StudentDashboard from "./pages/StudentDashboard";
import StudentVideos from "./pages/StudentVideos";
import SyllabusUpload from "./pages/upload/Upload";
import Vol from "./pages/SchoolRecommendations/SchoolRecommendations";
import PastSessions from "./pages/PastSessions";
import Onboarding from "./pages/Onboarding";
import Matching from "./pages/Matching";
import QuizApp from "./pages/Quiz";
import { GoogleTranslate } from "./GoogleTranslate";
import VolunteerDashboard from "./pages/SchoolDashboard";
import SyllabusTable from "./pages/Syllabus";
import VolunteerForm from "./pages/Onbaording/Volunteerboarding";
function AppWrapper() {
  const location = useLocation();
  const isSchoolPath = location.pathname.startsWith("/school");
  const isStudentPath = location.pathname.startsWith("/student");

  return (
    <>
      <GoogleTranslate />
      {isSchoolPath ? (
        <SchoolLayout>

          <Routes>
            <Route path="/school" element={<VolunteerDashboard />} />
            <Route path="/school/upload" element={<SyllabusUpload />} />
            <Route path="/school/volunteers" element={<Vol />} />
            <Route path="/school/syllabus" element={<SyllabusTable />} />
            <Route path="/school/settings" element={<SchoolSettings />} />
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
            <Route path="/student/videos" element={<StudentVideos />} />
            <Route path="/student/quiz" element={<QuizApp />} />
          </Routes>
        </StudentLayout>
      ) : (
        <VolunteerLayout>
          <Routes>
            <Route path="/Onboarding" element={<Onboarding />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/past-sessions" element={<PastSessions />} />
            <Route path="/sessions/:id" element={<SessionDetails />} />
            <Route path="/progress" element={<Progress />} />
            {/* <Route path="/settings" element={<Settings />} /> */}
            <Route path="/matching" element={<Matching />} />
            <Route path="/onboarding" element={<VolunteerForm/>} /> 
          </Routes>
        </VolunteerLayout>
      )}
    </>
  );
}

function App() {
  return <AppWrapper />;
}

export default App;