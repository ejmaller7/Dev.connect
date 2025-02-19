import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchTerm = searchParams.get('search');
  const category = searchParams.get('category');
  const salarySort = searchParams.get('salary_sort');

  const resultStyles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      minHeight: 'calc(100vh - 200px)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    backButton: {
      padding: '8px 16px',
      backgroundColor: '#555',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      textDecoration: 'none',
      fontSize: '0.9rem',
    },
    grid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      marginTop: '30px',
    },
    card: {
      backgroundColor: '#333',
      borderRadius: '8px',
      padding: '20px',
      color: 'white',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    cardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    },
    jobTitle: {
      margin: '0 0 10px 0',
      fontSize: '1.3rem',
      color: 'white',
    },
    company: {
      fontSize: '1.1rem',
      color: '#ccc',
      marginBottom: '10px',
    },
    tags: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      marginBottom: '15px',
    },
    tag: {
      padding: '4px 8px',
      backgroundColor: '#444',
      borderRadius: '4px',
      fontSize: '0.9rem',
    },
    salary: {
      display: 'inline-block',
      padding: '4px 12px',
      backgroundColor: '#4CAF50',
      borderRadius: '4px',
      marginRight: '10px',
      fontWeight: 'bold',
    },
    location: {
      display: 'inline-block',
      padding: '4px 8px',
      backgroundColor: '#555',
      borderRadius: '4px',
    },
    applyButton: {
      display: 'inline-block',
      marginTop: '15px',
      padding: '8px 16px',
      backgroundColor: '#2196F3',
      color: 'white',
      borderRadius: '4px',
      textDecoration: 'none',
      fontSize: '0.9rem',
      border: 'none',
      cursor: 'pointer',
    }
  };

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

  if (!searchTerm) {
    return (
      <div style={resultStyles.container}>
        <p style={{ color: 'white' }}>No search term provided.</p>
        <Link to="/" style={resultStyles.backButton}>Back to Home</Link>
      </div>
    );
  }

  return (
    <div style={resultStyles.container}>
      <div style={resultStyles.header}>
        <h2 style={{ color: 'white' }}>
          Results for "{searchTerm}"
          {salarySort && ` (Sorted by salary: ${salarySort === 'asc' ? 'Low to High' : 'High to Low'})`}
        </h2>
        <Link to="/" style={resultStyles.backButton}>Back to Home</Link>
      </div>

      {loading && <div style={{ color: 'white', textAlign: 'center' }}>Loading...</div>}
      
      {error && (
        <div style={{ color: '#ff4444', padding: '10px', margin: '10px 0' }}>
          {error}
        </div>
      )}

      <div style={resultStyles.grid}>
        {searchResults.map((job) => (
          <div
            key={job.id}
            style={resultStyles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
            }}
          >
            <h3 style={resultStyles.jobTitle}>{job.position}</h3>
            <div style={resultStyles.company}>{job.company}</div>
            
            <div style={resultStyles.tags}>
              {job.tags?.map((tag, index) => (
                <span key={index} style={resultStyles.tag}>
                  {tag}
                </span>
              ))}
            </div>

            <div>
              <span style={resultStyles.salary}>
                {formatSalary(job.salary_min, job.salary_max)}
              </span>
              <span style={resultStyles.location}>
                {job.location || 'Remote'}
              </span>
            </div>

            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              style={resultStyles.applyButton}
            >
              Apply Now →
            </a>
          </div>
        ))}
      </div>

      {searchResults.length === 0 && !loading && !error && (
        <div style={{ color: '#bbb', textAlign: 'center', marginTop: '30px' }}>
          No jobs found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default SearchResults;