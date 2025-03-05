import React, { useState, useEffect } from 'react';
import '../css/Jobs.css';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobType, setJobType] = useState('remote');

  useEffect(() => {
    console.log('Current jobType:', jobType);
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        let jobData = [];

        const jobsURL = import.meta.env.VITE_APP_ENV === 'production'
        ? 'https://dev-connect-invw.onrender.com'
        : 'http://localhost:5000';

        if (jobType === 'remote' || jobType === 'both') {
          const remoteResponse = await fetch(`${jobsURL}/api/remote-jobs`);
          if (!remoteResponse.ok) throw new Error('Failed to fetch remote jobs');
          const remoteJobs = await remoteResponse.json();
          jobData = [...jobData, ...remoteJobs];
        }

        if (jobType === 'onsite' || jobType === 'both') {
          const onsiteResponse = await fetch(`${jobsURL}/api/onsite-jobs`);
          console.log("response:", onsiteResponse)
          if (!onsiteResponse.ok) throw new Error('Failed to fetch on-site jobs');
          const onsiteJobs = await onsiteResponse.json();
          console.log('Fetched on-site jobs:', onsiteJobs);
          jobData = [...jobData, ...onsiteJobs];
        }

        setJobs(jobData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [jobType]);

  const handleJobClick = (job) => {
    setSelectedJob(job === selectedJob ? null : job);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) return <div className="loading">Loading jobs...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="job-list-container">
      <h2>Developer Jobs</h2>

      {/* Job Type Selection */}
      <div className="job-filter">
        <button className={jobType === 'remote' ? 'active' : ''} onClick={() => setJobType('remote')}>
          Remote Jobs
        </button>
        <button className={jobType === 'onsite' ? 'active' : ''} onClick={() => setJobType('onsite')}>
          On-Site Jobs
        </button>
        <button className={jobType === 'both' ? 'active' : ''} onClick={() => setJobType('both')}>
          Both
        </button>
      </div>

      {jobs.length === 0 ? (
        <p>No jobs found</p>
      ) : (
        <ul>
          {jobs.map((job, index) => (
            <li key={job.id || index} className="job-item">
              <h3 onClick={() => handleJobClick(job)}>
                {job.company_logo && (
                  <img src={job.company_logo || 'default-logo.png'} alt={`${job.company} logo`} className="job-logo" />
                )}
                <p className="job-position">{job.position || job.title}</p>
                <p className="job-company">Company: {job.company}</p>
                <p className="job-date">Date Posted: {formatDate(job.date || job.date_posted)}</p>
                <span className={`job-type ${jobType}`}>
                  {jobType === 'remote' ? 'Remote' : jobType === 'onsite' ? 'On-Site' : job.type}
                </span>
              </h3>

              {selectedJob && selectedJob.id === job.id && (
                <div className="job-details">
                  <p><strong>Tags:</strong> {job.tags?.join(', ') || 'N/A'}</p>
                  <p><strong>Location:</strong> {job.location}</p>
                  <section className="job-description-container">
                    <p><strong>Description:</strong></p>
                    <article
                      className="job-description"
                      dangerouslySetInnerHTML={{ __html: job.description || 'No description available' }}
                    />
                  </section>
                  {job.salary_min && job.salary_max && (
                    <p className="salary">
                      <strong>Salary:</strong> ${job.salary_min} - ${job.salary_max} per year
                    </p>
                  )}
                  <a href={job.apply_url || job.url} target="_blank" rel="noopener noreferrer" className="apply-button">
                    Apply Here
                  </a>
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
