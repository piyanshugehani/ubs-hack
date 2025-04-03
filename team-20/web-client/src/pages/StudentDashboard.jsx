import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentProgress from "./StudentProgress";

function StudentDashboard() {
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const sessions = {
    upcoming: [
      {
        id: 1,
        subject: "Mathematics - Algebra",
        date: "Apr 10, 3:00 PM",
        details: "This session will cover quadratic equations and polynomials.",
        recordingURL: "#",
        notesURL: "#",
      },
      {
        id: 2,
        subject: "Physics - Mechanics",
        date: "Apr 12, 11:00 AM",
        details: "We will discuss Newton’s Laws and friction.",
        recordingURL: "#",
        notesURL: "#",
      },
      {
        id: 3,
        subject: "Chemistry - Organic",
        date: "Apr 14, 2:00 PM",
        details: "Introduction to hydrocarbons and functional groups.",
        recordingURL: "#",
        notesURL: "#",
      },
    ],
    past: [
      {
        id: 4,
        subject: "Biology - Cell Structure",
        date: "Apr 5, 10:00 AM",
        details: "Reviewed cell organelles and their functions.",
        recordingURL: "#",
        notesURL: "#",
      },
      {
        id: 5,
        subject: "History - World War II",
        date: "Apr 3, 1:00 PM",
        details: "Discussed key battles and impacts of WWII.",
        recordingURL: "#",
        notesURL: "#",
      },
      {
        id: 6,
        subject: "Computer Science - OOP",
        date: "Apr 1, 4:00 PM",
        details: "Covered inheritance, polymorphism, and abstraction.",
        recordingURL: "#",
        notesURL: "#",
      },
    ],
  };

  const openModal = (session, type) => {
    setSelectedSession(session);
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
    <div className="row">
      {/* Student Progress Card */}
      <div className="col-lg-6 mb-4 d-flex align-items-center justify-content-center ">
        <div className="card h-100">
          <div className="d-flex align-items-end row ">
            <div className="col-sm-7 ">
              <div className="card-body mt-4">
                <h5 className="card-title text-primary">
                  Great Job, [Student Name]! 🎉
                </h5>
                <p className="mb-4">
                  You have completed <span className="fw-medium">72%</span> of
                  your syllabus chapters. Keep up the good work!
                </p>
                <a
                  aria-label="view progress details"
                  href="#"
                  className="btn btn-sm btn-outline-primary"
                >
                  View Progress
                </a>
              </div>
            </div>
            <div className="col-sm-5 text-center text-sm-left">
              <div className="card-body pb-0 px-0 px-md-4">
                <img
                  aria-label="student progress image"
                  src="../public/assets/img/avatars/1.png"
                  height="120"
                  width="120"
                  className="rounded-circle"
                  alt="Student Progress"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions Card */}
      <div className="col-lg-6 mb-4">
        <div className="card h-100">
          <div className="card-header">
            <ul className="nav nav-pills" role="tablist">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  data-bs-toggle="tab"
                  href="#upcoming"
                >
                  Upcoming Sessions
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab" href="#past">
                  Past Sessions
                </a>
              </li>
            </ul>
          </div>
          <div className="card-body px-0">
            <div className="tab-content p-3">
              <div className="tab-pane fade show active" id="upcoming">
                <h6>Upcoming Sessions</h6>
                <ul className="list-group">
                  {sessions.upcoming.map((session) => (
                    <li
                      key={session.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {session.subject} | {session.date}
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openModal(session, "upcoming")}
                      >
                        Details
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="tab-pane fade" id="past">
                <h6>Past Sessions</h6>
                <ul className="list-group">
                  {sessions.past.map((session) => (
                    <li
                      key={session.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {session.subject} | {session.date}
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openModal(session, "past")}
                      >
                        Details
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      {/* Modal for Sessions */}
      {showModal && selectedSession && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedSession.subject}</h5>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Date & Time:</strong> {selectedSession.date}
                </p>
                <p>{selectedSession.details}</p>
              </div>
              <div className="modal-footer d-flex justify-content-between w-100">
                {/* Left-aligned buttons */}
                <div className="d-flex gap-2">
                  {modalType === "upcoming" && (
                    <button className="btn btn-primary">⏰ Add Reminder</button>
                  )}
                  {modalType === "past" && (
                    <>
                      <a
                        href={selectedSession.recordingURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                      >
                        📹 View Recording
                      </a>
                      <a
                        href={selectedSession.notesURL}
                        download
                        className="btn btn-success"
                      >
                        📄 Download Notes
                      </a>
                    </>
                  )}
                </div>
                {/* Right-aligned close button */}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    <div className="row">
            <StudentProgress />
    </div>
    </>
  );
}

export default StudentDashboard;
