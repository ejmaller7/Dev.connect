import React, { useState, useEffect } from 'react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <div>Loading jobs...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Developer Remote Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs found</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              <h3>{job.position}</h3>
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Location:</strong> {job.location || 'Remote'}</p>
              <p><strong>Tags:</strong> {job.tags?.join(', ') || 'N/A'}</p>
              <p><strong>Description:</strong> {job.description}</p>
              <a href={job.apply_url} target="_blank" rel="noopener noreferrer">Apply Here</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Jobs;
