/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);
export default function VolunteerDashboard() {
  const [date, setDate] = useState(new Date());
  const [volunteerStats, setVolunteerStats] = useState({
    assigned: 78,
    rejected: 12,
    completed: 53,
    pending: 25,
    overtime: 8
  });
  const [volunteerSlots, setVolunteerSlots] = useState({
    "2025-04-03": [
      { id: 1, name: "Aarav Sharma", time: "09:00 - 11:00", status: "confirmed", school: "Lincoln Elementary" },
      { id: 2, name: "Ishita Verma", time: "13:00 - 15:00", status: "confirmed", school: "Lincoln Elementary" }
    ],
    "2025-04-04": [
      { id: 3, name: "Rohan Gupta", time: "10:00 - 12:00", status: "pending", school: "Washington High" }
    ],
    "2025-04-05": [
      { id: 4, name: "Priya Nair", time: "09:00 - 11:00", status: "rejected", school: "Roosevelt Middle School" }
    ],
    "2025-04-08": [
      { id: 5, name: "Ananya Iyer", time: "14:00 - 16:00", status: "confirmed", school: "Jefferson Academy" }
    ]
  });
  // Generate sample data for charts
  const generateMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const assignedData = months.map((_, i) => Math.floor(Math.random() * 30) + 50);
    const completedData = assignedData.map(val => val - Math.floor(Math.random() * 15));
    return { months, assignedData, completedData };
  };

  const { months, assignedData, completedData } = generateMonthlyData();

  // Line chart data for volunteer completion trends
  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: 'Assigned Volunteers',
        data: assignedData,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Completed Tasks',
        data: completedData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
      },
    ],
  };

  // Bar chart data for volunteer status breakdown
  const barChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'On Time',
        data: [12, 15, 18, 14],
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      },
      {
        label: 'Overtime',
        data: [3, 2, 5, 4],
        backgroundColor: 'rgba(255, 159, 64, 0.7)',
      },
      {
        label: 'Incomplete',
        data: [5, 4, 3, 6],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
      },
    ],
  };

  // Doughnut chart for volunteer status
  const doughnutChartData = {
    labels: ['Completed', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [volunteerStats.completed, volunteerStats.pending, volunteerStats.rejected],
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 205, 86, 0.7)',
          'rgba(255, 99, 132, 0.7)',
        ],
        borderColor: [
          'rgb(75, 192, 192)',
          'rgb(255, 205, 86)',
          'rgb(255, 99, 132)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Function to generate heatmap data
  const generateContributionData = () => {
    const data = [];
    for (let i = 0; i < 7; i++) {
      const row = [];
      for (let j = 0; j < 12; j++) {
        row.push(Math.floor(Math.random() * 4));
      }
      data.push(row);
    }
    return data;
  };

  const contributionData = generateContributionData();

  // Format date as YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Get slots for a specific date
  const getSlotsForDate = (date) => {
    const dateKey = formatDate(date);
    return volunteerSlots[dateKey] || [];
  };

  // Custom tile content for calendar to show volunteer assignments
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const dateKey = formatDate(date);
    const slots = volunteerSlots[dateKey] || [];
    
    if (slots.length === 0) return null;
    
    const statusColors = {
      confirmed: '#28a745',
      pending: '#ffc107',
      rejected: '#dc3545'
    };
    
    return (
      <div className="d-flex justify-content-center">
        {slots.map((_, idx) => (
          <div 
            key={idx} 
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: statusColors[slots[idx].status],
              margin: '2px'
            }}
          />
        ))}
      </div>
    );
  };

  // Sample unassigned volunteer requests
  const unassignedRequests = [
    { id: 101, school: "Lincoln Elementary", date: "2025-04-10", time: "13:00 - 15:00", requestedOn: "2025-04-01" },
    { id: 102, school: "Washington High", date: "2025-04-12", time: "09:00 - 11:00", requestedOn: "2025-04-02" },
    { id: 103, school: "Jefferson Academy", date: "2025-04-15", time: "14:00 - 16:00", requestedOn: "2025-04-02" },
  ];

  return (
    <div className="container-fluid p-4">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="text-primary fw-bold">Volunteer Management Dashboard</h2>
          <p className="text-muted">Track volunteer assignments, completions, and school requests</p>
        </div>
      </div>

      {/* First Row: Stats Cards */}
      <div className="row g-4">
        {/* Assigned Volunteers */}
        <div className="col-md-4 col-lg-2">
          <div className="card h-100">
            <div className="card-body p-3">
              <div className="d-flex align-items-center mb-2">
                <div className="avatar bg-primary bg-opacity-10 p-2 rounded me-3">
                  <i className="bi bi-people-fill fs-4 text-primary"></i>
                </div>
                <h6 className="card-title mb-0">Assigned</h6>
              </div>
              <h3 className="fw-bold mb-1">{volunteerStats.assigned}</h3>
              <div className="progress" style={{height: "4px"}}>
                <div className="progress-bar bg-primary" style={{width: "100%"}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="col-md-4 col-lg-2">
          <div className="card h-100">
            <div className="card-body p-3">
              <div className="d-flex align-items-center mb-2">
                <div className="avatar bg-success bg-opacity-10 p-2 rounded me-3">
                  <i className="bi bi-check-circle-fill fs-4 text-success"></i>
                </div>
                <h6 className="card-title mb-0">Completed</h6>
              </div>
              <h3 className="fw-bold mb-1">{volunteerStats.completed}</h3>
              <div className="progress" style={{height: "4px"}}>
                <div className="progress-bar bg-success" style={{width: `${(volunteerStats.completed/volunteerStats.assigned)*100}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="col-md-4 col-lg-2">
          <div className="card h-100">
            <div className="card-body p-3">
              <div className="d-flex align-items-center mb-2">
                <div className="avatar bg-warning bg-opacity-10 p-2 rounded me-3">
                  <i className="bi bi-hourglass-split fs-4 text-warning"></i>
                </div>
                <h6 className="card-title mb-0">Pending</h6>
              </div>
              <h3 className="fw-bold mb-1">{volunteerStats.pending}</h3>
              <div className="progress" style={{height: "4px"}}>
                <div className="progress-bar bg-warning" style={{width: `${(volunteerStats.pending/volunteerStats.assigned)*100}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Rejected Tasks */}
        <div className="col-md-4 col-lg-2">
          <div className="card h-100">
            <div className="card-body p-3">
              <div className="d-flex align-items-center mb-2">
                <div className="avatar bg-danger bg-opacity-10 p-2 rounded me-3">
                  <i className="bi bi-x-circle-fill fs-4 text-danger"></i>
                </div>
                <h6 className="card-title mb-0">Rejected</h6>
              </div>
              <h3 className="fw-bold mb-1">{volunteerStats.rejected}</h3>
              <div className="progress" style={{height: "4px"}}>
                <div className="progress-bar bg-danger" style={{width: `${(volunteerStats.rejected/volunteerStats.assigned)*100}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Overtime */}
        <div className="col-md-4 col-lg-2">
          <div className="card h-100">
            <div className="card-body p-3">
              <div className="d-flex align-items-center mb-2">
                <div className="avatar bg-info bg-opacity-10 p-2 rounded me-3">
                  <i className="bi bi-clock-history fs-4 text-info"></i>
                </div>
                <h6 className="card-title mb-0">Overtime</h6>
              </div>
              <h3 className="fw-bold mb-1">{volunteerStats.overtime}</h3>
              <div className="progress" style={{height: "4px"}}>
                <div className="progress-bar bg-info" style={{width: `${(volunteerStats.overtime/volunteerStats.assigned)*100}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Efficiency Rate */}
        <div className="col-md-4 col-lg-2">
          <div className="card h-100">
            <div className="card-body p-3">
              <div className="d-flex align-items-center mb-2">
                <div className="avatar bg-secondary bg-opacity-10 p-2 rounded me-3">
                  <i className="bi bi-graph-up fs-4 text-secondary"></i>
                </div>
                <h6 className="card-title mb-0">Efficiency</h6>
              </div>
              <h3 className="fw-bold mb-1">{Math.round((volunteerStats.completed/volunteerStats.assigned)*100)}%</h3>
              <div className="progress" style={{height: "4px"}}>
                <div className="progress-bar bg-secondary" style={{width: `${(volunteerStats.completed/volunteerStats.assigned)*100}%`}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row: Charts and Calendar */}
      <div className="row g-4 mt-2">
        {/* Volunteer Completion Trend Chart */}
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center p-3">
              <h5 className="card-title m-0">Volunteer Task Completion Trends</h5>
              <div className="dropdown">
                <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" id="chartPeriodDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  This Year
                </button>
                <ul className="dropdown-menu" aria-labelledby="chartPeriodDropdown">
                  <li><a className="dropdown-item" href="#">This Month</a></li>
                  <li><a className="dropdown-item" href="#">This Quarter</a></li>
                  <li><a className="dropdown-item" href="#">This Year</a></li>
                </ul>
              </div>
            </div>
            <div className="card-body p-3">
              <Line 
                data={lineChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    }
                  }
                }} 
                height={250}
              />
            </div>
          </div>
        </div>

        {/* Status Distribution Chart */}
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header p-3">
              <h5 className="card-title m-0">Volunteer Status Distribution</h5>
            </div>
            <div className="card-body d-flex justify-content-center align-items-center">
              <div style={{ height: '250px', width: '100%' }}>
                <Doughnut 
                  data={doughnutChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Third Row: Weekly Breakdown & Calendar */}
      <div className="row g-4 mt-4">
        {/* Weekly Breakdown */}
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header p-3">
              <h5 className="card-title m-0">Weekly Task Completion</h5>
            </div>
            <div className="card-body p-3">
              <Bar 
                data={barChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    x: {
                      stacked: false,
                    },
                    y: {
                      stacked: false,
                      beginAtZero: true,
                    }
                  }
                }} 
                height={250}
              />
            </div>
          </div>
        </div>

        {/* Volunteer Schedule Calendar */}
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header p-3">
              <h5 className="card-title m-0">Volunteer Schedule</h5>
            </div>
            <div className="card-body p-3">
              <Calendar 
                onChange={setDate} 
                value={date}
                tileContent={tileContent}
                className="w-100 border-0"
              />
              <div className="mt-3">
                <div className="d-flex align-items-center mb-2">
                  <small className="text-muted me-3">Selected Date: {date.toLocaleDateString()}</small>
                  <div className="d-flex align-items-center me-2">
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#28a745', marginRight: '4px' }}></div>
                    <small className="text-muted">Confirmed</small>
                  </div>
                  <div className="d-flex align-items-center me-2">
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ffc107', marginRight: '4px' }}></div>
                    <small className="text-muted">Pending</small>
                  </div>
                  <div className="d-flex align-items-center">
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dc3545', marginRight: '4px' }}></div>
                    <small className="text-muted">Rejected</small>
                  </div>
                </div>
                
                {getSlotsForDate(date).length > 0 ? (
                  <div>
                    <h6 className="mb-2">Assignments on {date.toLocaleDateString()}</h6>
                    <div className="list-group">
                      {getSlotsForDate(date).map(slot => (
                        <div key={slot.id} className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                          slot.status === 'confirmed' ? 'list-group-item-success' : 
                          slot.status === 'pending' ? 'list-group-item-warning' : 
                          'list-group-item-danger'
                        }`}>
                          <div>
                            <div className="fw-bold">{slot.name}</div>
                            <small>{slot.time} • {slot.school}</small>
                          </div>
                          <div>
                            <span className="badge bg-primary rounded-pill">{slot.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-3">
                    <p className="text-muted mb-0">No volunteer assignments for this date</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fourth Row: Unassigned Requests and Volunteer Activity */}
      <div className="row g-4 mt-4">
        {/* Unassigned Requests */}
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center p-3">
              <h5 className="card-title m-0">Unassigned School Requests</h5>
              <span className="badge bg-danger rounded-pill">{unassignedRequests.length} Pending</span>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table m-0">
                  <thead>
                    <tr>
                      <th className="px-4">School</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Requested On</th>
                      <th className="px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unassignedRequests.map(request => (
                      <tr key={request.id}>
                        <td className="px-4">{request.school}</td>
                        <td>{request.date}</td>
                        <td>{request.time}</td>
                        <td>{request.requestedOn}</td>
                        <td className="px-4">
                          <button className="btn btn-sm btn-primary me-2">Assign</button>
                          <button className="btn btn-sm btn-outline-danger">Decline</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Volunteer Activity Heatmap */}
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header p-3">
              <h5 className="card-title m-0">Volunteer Activity Heatmap</h5>
            </div>
            <div className="card-body p-4">
              <div className="contribution-heatmap mb-3">
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
                        title={`${value} volunteers`}
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <p className="mb-0 text-muted small">Based on volunteer activity in the last 12 weeks</p>
                <div className="d-flex align-items-center">
                  <div style={{ width: '10px', height: '10px', backgroundColor: 'rgba(40, 167, 69, 0)', border: '1px solid #ddd', marginRight: '4px' }}></div>
                  <small className="text-muted me-2">Less</small>
                  <div style={{ width: '10px', height: '10px', backgroundColor: 'rgba(40, 167, 69, 0.25)', marginRight: '4px' }}></div>
                  <div style={{ width: '10px', height: '10px', backgroundColor: 'rgba(40, 167, 69, 0.5)', marginRight: '4px' }}></div>
                  <div style={{ width: '10px', height: '10px', backgroundColor: 'rgba(40, 167, 69, 0.75)', marginRight: '4px' }}></div>
                  <div style={{ width: '10px', height: '10px', backgroundColor: 'rgba(40, 167, 69, 1)', marginRight: '4px' }}></div>
                  <small className="text-muted">More</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}