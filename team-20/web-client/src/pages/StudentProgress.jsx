const StudentProgress = () => {
  return (
    <div className="row">
      <div className="col-md-6 col-lg-8 col-xl-8 order-0 mb-4">
        <div className="card h-100">
          <div className="card-header d-flex align-items-center justify-content-between pb-0">
            <div className="card-title mb-0">
              <h5 className="m-0 me-2">Student Progress</h5>
            </div>
            <div className="dropdown">
              <button
                aria-label="Click me"
                className="btn p-0"
                type="button"
                id="studentProgress"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="bx bx-dots-vertical-rounded"></i>
              </button>
              <div
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="studentProgress"
              >
                <a aria-label="select all " className="dropdown-item" href="#">
                  Select All
                </a>
                <a aria-label="refresh" className="dropdown-item" href="#">
                  Refresh
                </a>
                <a aria-label="share" className="dropdown-item" href="#">
                  Share
                </a>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div id="studentProgressChart"></div>
            </div>
            <ul className="p-0 m-0">
              {[
                { subject: "Mathematics", topics: "Algebra, Geometry, Calculus", icon: "bx-calculator" },
                { subject: "Science", topics: "Physics, Chemistry, Biology", icon: "bx-book" },
                { subject: "Social Studies", topics: "History, Geography, Civics", icon: "bx-globe" },
                { subject: "English", topics: "Grammar, Literature, Writing", icon: "bx-pencil" },
              ].map(({ subject, topics, icon }, index) => (
                <li key={index} className="d-flex mb-4 pb-1">
                  <div className="avatar flex-shrink-0 me-3">
                    <span className="avatar-initial rounded bg-label-primary">
                      <i className={`bx ${icon}`}></i>
                    </span>
                  </div>
                  <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                    <div className="me-2">
                      <h6 className="mb-0">{subject}</h6>
                      <small className="text-muted">{topics}</small>
                    </div>
                    <button className="btn btn-primary">View Course Details</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Profit Card */}
      <div className="col-md-4 col-lg-4 col-xl-4 mb-4">
      {/* Download Notes Card */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="card-title d-flex align-items-start justify-content-between">
            <div className="avatar flex-shrink-0">
              <span className="avatar-initial rounded bg-label-primary">
                <i className="bx bx-download"></i>
              </span>
            </div>
            <div className="dropdown">
              {/* <button
                aria-label="Click me"
                className="btn p-0"
                type="button"
                id="cardOpt1"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="bx bx-dots-vertical-rounded"></i>
              </button> */}
              <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt1">
                <a aria-label="view more" className="dropdown-item" href="#">
                  View More
                </a>
                <a aria-label="delete" className="dropdown-item" href="#">
                  Delete
                </a>
              </div>
            </div>
          </div>
          <span className="fw-medium d-block mb-1">Download Notes</span>
          <button className="btn btn-primary">
            <i className="bx bx-download me-2"></i> Download
          </button>
        </div>
      </div>

      {/* View Video Lectures Card */}
      <div className="card">
        <div className="card-body">
          <div className="card-title d-flex align-items-start justify-content-between">
            <div className="avatar flex-shrink-0">
              <span className="avatar-initial rounded bg-label-success">
                <i className="bx bx-video"></i>
              </span>
            </div>
            <div className="dropdown">
              {/* <button
                aria-label="Click me"
                className="btn p-0"
                type="button"
                id="cardOpt2"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="bx bx-dots-vertical-rounded"></i>
              </button> */}
              <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt2">
                <a aria-label="view more" className="dropdown-item" href="#">
                  View More
                </a>
                <a aria-label="delete" className="dropdown-item" href="#">
                  Delete
                </a>
              </div>
            </div>
          </div>
          <span className="fw-medium d-block mb-1">View Video Lectures</span>
          <button className="btn btn-success">
            <i className="bx bx-play-circle me-2"></i> Watch Now
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default StudentProgress;
