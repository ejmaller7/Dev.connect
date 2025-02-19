import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import '../css/SearchResults.css'; // Assuming you'll save the CSS in this file

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const searchTerm = searchParams.get('search');
  const category = searchParams.get('category');
  const salarySort = searchParams.get('salary_sort');

  useEffect(() => {
    const fetchJobs = async () => {
      if (!searchTerm) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('https://remoteok.com/api');
        const data = await response.json();

        // Filter jobs based on search term
        let filteredJobs = data.filter(job => 
          job.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Sort by salary if specified
        if (salarySort) {
          filteredJobs.sort((a, b) => {
            const salaryA = parseInt(a.salary_min) || 0;
            const salaryB = parseInt(b.salary_min) || 0;
            return salarySort === 'asc' ? salaryA - salaryB : salaryB - salaryA;
          });
        }

        setSearchResults(filteredJobs);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to fetch jobs. Please try again.');
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchTerm, salarySort]);

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not specified';
    if (!max) return `$${min}+`;
    if (!min) return `Up to $${max}`;
    return `$${min} - $${max}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!searchTerm) {
    return (
      <div className="job-list-container">
        <p>No search term provided.</p>
        <Link to="/" className="apply-btn">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="job-list-container">
      <h2>
        Results for "{searchTerm}"
        {salarySort && ` (Sorted by salary: ${salarySort === 'asc' ? 'Low to High' : 'High to Low'})`}
      </h2>
      
      {loading && <div className="loading">Loading...</div>}
      
      {error && <div className="error">{error}</div>}

      <ul>
        {searchResults.map((job) => (
          <li 
            key={job.id}
            className={`job-item ${selectedJob === job.id ? 'selected' : ''}`}
            onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
          >
            {job.company_logo && (
              <img 
                src={job.company_logo} 
                alt={`${job.company} logo`} 
                className="job-logo"
              />
            )}
            
            <h3 className="job-title">{job.position}</h3>
            <p className="job-company">{job.company}</p>
            <p className="location">{job.location || 'Remote'}</p>
            
            <span className="salary">
              {formatSalary(job.salary_min, job.salary_max)}
            </span>

            {selectedJob === job.id && (
              <div className="job-details">
                <div className="job-description-container">
                  <p className="job-description">{job.description}</p>
                </div>
                
                <div>
                  {job.tags?.map((tag, index) => (
                    <span key={index}>{tag}</span>
                  ))}
                </div>

                <p className="job-date">
                  Posted: {formatDate(job.date)}
                </p>

                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apply-btn"
                >
                  Apply Now
                </a>
              </div>
            )}
          </li>
        ))}
      </ul>

      {searchResults.length === 0 && !loading && !error && (
        <div className="error">
          No jobs found matching "{searchTerm}"
        </div>
      )}
      
      <Link to="/" className="apply-btn">Back to Home</Link>
    </div>
  );
};

export default SearchResults;