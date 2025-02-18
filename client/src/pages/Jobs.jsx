import React, { useState, useEffect } from 'react';
import '../css/Jobs.css'


const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/remote-jobs');
        if (!response.ok) {
          throw new Error('Failed to fetch job data');
        }

        const jobData = await response.json();
        setJobs(jobData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleJobClick = (job) => {
    setSelectedJob(job === selectedJob ? null : job); 
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();  
  };

  if (loading) {
    return <div className="loading">Loading jobs...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="job-list-container">
      <h2>Developer Remote Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs found</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job.id} className="job-item">
              <h3 onClick={() => handleJobClick(job)}>
                {job.company_logo && (
                  <img
                    src={job.company_logo || 'default-logo.png'}
                    alt={`${job.company} logo`}
                    className="job-logo"
                    onError={(e) => {
                      // e.target.src = 'default-logo.png'; 
                      // e.target.alt = ''; // Set an alternative description if the logo fails
                    }}
                  />
                )} 
                <p className="job-position">{job.position}</p>
                <p className="job-company">Company: {job.company}</p>
                <p className="job-date">Date Posted: {formatDate(job.date)}</p>
                <span>{'Remote'}</span>
              </h3>

              {/* If the job is selected, display the additional details */}
              {selectedJob && selectedJob.id === job.id && (
                <div className="job-details">
                  <p><strong>Tags:</strong> {job.tags?.join(', ') || 'N/A'}</p>
                  <section className="job-description-container">
                    <p><strong>Description:</strong></p>
                    <article 
                    className="job-description"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                  </section>
                  <p className="salary"><strong>Salary:</strong> ${job.salary_min} - ${job.salary_max} per year</p>
                  <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="apply-btn">Apply Here</a>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Jobs;
