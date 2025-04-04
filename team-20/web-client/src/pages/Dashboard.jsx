/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-undef */
import { useEffect } from "react";
import LineChart from "../components/LineChart";

export default function Dashboard() {
    useEffect(() => {
        dashboardAnalitics();
    }, []);
    // Generate sample contribution data for the heatmap
    const generateContributionData = () => {
        const data = [];
        for (let i = 0; i < 7; i++) {
            const row = [];
            for (let j = 0; j < 12; j++) {
                row.push(Math.floor(Math.random() * 4)); // 0-3 for different intensity levels
            }
            data.push(row);
        }
        return data;
    };
    const contributionData = generateContributionData();
    return (
        <div className="container-fluid p-4">
            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card h-100">
                        <div className="d-flex align-items-end row g-0">
                            <div className="col-sm-7">
                                <div className="card-body">
                                    <h5 className="text-primary text-4xl font-extrabold mb-3">
                                        Welcome back, Ananya! 🎓
                                    </h5>
                                    <p className="mb-4">
                                        You've positively impacted <span className="fw-medium">127</span> students
                                        this month. Your next session is in 2 hours.
                                    </p>
                                    <a href="#" className="btn btn-sm btn-outline-primary">
                                        Join Next Session
                                    </a>
                                </div>
                            </div>
                            <div className="col-sm-5 text-center text-sm-left">
                                <div className="card-body pb-0 px-0 px-md-4">
                                    <img
                                        src="./assets/img/iconnnnnn.jpg"
                                        height="140"
                                        alt="Volunteer Teacher"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contribution Heatmap */}
                <div className="col-lg-4">
                    <div className="card h-100">
                        <div className="card-body p-4">
                            <h5 className="card-title mb-3">Your Teaching Streak</h5>
                            <div className="contribution-heatmap">
                                {contributionData.map((row, i) => (
                                    <div key={i} className="d-flex gap-1 mb-1">
                                        {row.map((value, j) => (
                                            <div
                                                key={j}
                                                className="contribution-box"
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    backgroundColor: `rgba(40, 167, 69, ${value * 0.25})`,
                                                    borderRadius: '2px'
                                                }}
                                                title={`${value} contributions`}
                                            ></div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <p className="mt-2 mb-0 text-muted">
                                Based on your teaching activity in the last 12 weeks
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Second Row: Upcoming Sessions + Stats Cards */}
            <div className="row g-4 mt-4">
                {/* Upcoming Sessions */}
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header d-flex align-items-center justify-content-between p-3">
                            <h5 className="m-0">Upcoming Sessions</h5>
                            <button className="btn btn-primary btn-sm">Schedule New</button>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table m-0">
                                    <thead>
                                        <tr>
                                            <th className="px-4">Date</th>
                                            <th>Time</th>
                                            <th>Topic</th>
                                            <th>Students</th>
                                            <th className="px-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="px-4">Today</td>
                                            <td>14:00</td>
                                            <td>Mathematics - Algebra</td>
                                            <td>15</td>
                                            <td className="px-4">
                                                <button className="btn btn-sm btn-primary">Join</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Stats Cards */}
                <div className="col-lg-4">
                    <div className="row g-4">
                        <div className="col-lg-6 col-md-6">
                            <div className="card h-100">
                                <div className="card-body p-3">
                                    <div className="card-title d-flex align-items-start justify-content-between mb-3">
                                        <div className="avatar flex-shrink-0">
                                            <img
                                                src="https://cdn-icons-png.freepik.com/512/7128/7128192.png"
                                                alt="Sessions"
                                                className="rounded"
                                                width="40"
                                            />
                                        </div>
                                    </div>
                                    <span className="fw-medium d-block mb-1">Total Sessions</span>
                                    <h3 className="card-title mb-2">48</h3>
                                    <small className="text-success fw-medium">
                                        <i className="bx bx-up-arrow-alt"></i> +12 this month
                                    </small>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <div className="card h-100">
                                <div className="card-body p-3">
                                    <div className="card-title d-flex align-items-start justify-content-between mb-3">
                                        <div className="avatar flex-shrink-0">
                                            <img
                                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFY4SKapLBdbW38LLrQOEn7QhCdgNS_ilcag&s"
                                                alt="Students"
                                                className="rounded"
                                                width="40"
                                            />
                                        </div>
                                    </div>
                                    <span className="fw-medium d-block mb-1">Students Impacted</span>
                                    <h3 className="card-title text-nowrap mb-2">127</h3>
                                    <small className="text-success fw-medium">
                                        <i className="bx bx-up-arrow-alt"></i> +28 new students
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Third Row: Bottom section (unchanged) */}
            <div className="row g-4 mt-4">
                {/* Student Progress */}
                <div className="col-md-8">
                    <div className="card h-100">
                        <LineChart />
                    </div>
                </div>

                {/* Quick Actions
                <div className="col-md-4">
                    <div className="card h-100">
                        <div className="card-header p-3">
                            <h5 className="card-title m-0">Quick Actions</h5>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-grid gap-3">
                                <button className="btn btn-primary">Upload Study Material</button>
                                <button className="btn btn-outline-primary">Answer Student Queries</button>
                                <button className="btn btn-outline-primary">View Session Reports</button>
                                <button className="btn btn-outline-primary">Join Volunteer Forum</button>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Recent Activities */}
                <div className="col-md-4">
                    <div className="card h-100">
                        <div className="card-header p-3">
                            <h5 className="card-title m-0">Recent Activities</h5>
                        </div>
                        <div className="card-body p-4">
                            <ul className="timeline-list list-unstyled">
                                <li className="timeline-item pb-4">
                                    <span className="timeline-point"></span>
                                    <div className="timeline-event">
                                        <div className="timeline-header mb-1">
                                            <h6 className="mb-0">Mathematics Session Completed</h6>
                                            <small className="text-muted">2 hours ago</small>
                                        </div>
                                        <p className="mb-0">15 students attended</p>
                                    </div>
                                </li>
                                <li className="timeline-item">
                                    <span className="timeline-point"></span>
                                    <div className="timeline-event">
                                        <div className="timeline-header mb-1">
                                            <h6 className="mb-0">New Student Query</h6>
                                            <small className="text-muted">5 hours ago</small>
                                        </div>
                                        <p className="mb-0">Query about Algebra homework</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}