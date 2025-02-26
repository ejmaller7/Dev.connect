import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import '../css/SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const searchTerm = searchParams.get('search');
  const category = searchParams.get('category') || 'all';
  const salarySort = searchParams.get('salary_sort');

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm) return;

      setLoading(true);
      setError(null);
      setSearchResults([]);

      try {
        let results = [];

        // Determine which API to call based on category
        if (category === 'jobs' || category === 'all') {
          const jobResults = await fetchJobsData(searchTerm, salarySort);
          results = [...results, ...jobResults.map(job => ({
            ...job,
            type: 'job',
            title: job.position,
            description: job.description || 'No description available'
          }))];
        }

        if (category === 'all' || category === 'messages' || category === 'network' || category === 'profiles') {
          // For demo purposes, we'll fetch articles from dev.to for non-job categories
          const articleResults = await fetchArticlesData(searchTerm);
          
          // Map articles to different types based on category
          const mappedArticles = articleResults.map(article => {
            let type = 'article';
            
            if (category === 'messages') {
              type = 'message';
            } else if (category === 'network') {
              type = 'network';
            } else if (category === 'profiles') {
              type = 'profile';
            }
            
            return {
              ...article,
              type,
              title: article.title,
              description: article.description
            };
          });
          
          // Only add these results if we're in the appropriate category
          if (category === 'all' || 
            category === 'messages' || 
            category === 'network' || 
            category === 'profiles') {
          results = [...results, ...mappedArticles];
        }
        }

        setSearchResults(results);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchTerm, category, salarySort]);

  // Function to fetch jobs data from remoteok API
  const fetchJobsData = async (term, sort) => {
    try {
      const response = await fetch('https://remoteok.com/api');
      const data = await response.json();

      // Filter jobs based on search term
      let filteredJobs = data.filter(job => 
        job.position?.toLowerCase().includes(term.toLowerCase()) ||
        job.company?.toLowerCase().includes(term.toLowerCase())
      );

      // Sort by salary if specified
      if (sort) {
        filteredJobs.sort((a, b) => {
          const salaryA = parseInt(a.salary_min) || 0;
          const salaryB = parseInt(b.salary_min) || 0;
          return sort === 'asc' ? salaryA - salaryB : salaryB - salaryA;
        });
      }

      return filteredJobs;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }
  };

  // Function to fetch articles data from dev.to API
  const fetchArticlesData = async (term) => {
    try {
      const response = await fetch(`https://dev.to/api/articles?tag=${encodeURIComponent(term)}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching articles:', error);
      return [];
    }
  };

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

  const getCategoryTitle = () => {
    switch (category) {
      case 'jobs': return 'Jobs';
      case 'messages': return 'Messages';
      case 'network': return 'Network';
      case 'profiles': return 'Profiles';
      default: return 'All Results';
    }
  };

  const renderResultItem = (item) => {
    switch (item.type) {
      case 'job':
        return renderJobItem(item);
      case 'message':
        return renderMessageItem(item);
      case 'network':
        return renderNetworkItem(item);
      case 'profile':
        return renderProfileItem(item);
      default:
        return renderArticleItem(item);
    }
  };

  const renderJobItem = (job) => (
    <li 
      key={job.id}
      className={`result-item job-item ${selectedItem?.id === job.id && selectedItem?.type === 'job' ? 'selected' : ''}`}
      onClick={() => setSelectedItem(selectedItem?.id === job.id ? null : { id: job.id, type: 'job' })}
    >
      {job.company_logo && (
        <img 
          src={job.company_logo} 
          alt={`${job.company} logo`} 
          className="result-logo"
        />
      )}
      
      <h3 className="result-title">{job.position}</h3>
      <p className="result-subtitle">{job.company}</p>
      <p className="result-location">{job.location || 'Remote'}</p>
      
      <span className="result-badge salary">
        {formatSalary(job.salary_min, job.salary_max)}
      </span>

      {selectedItem?.id === job.id && selectedItem?.type === 'job' && (
        <div className="result-details">
          <div className="result-description-container">
            <p className="result-description">{job.description}</p>
          </div>
          
          <div className="result-tags">
            {job.tags?.map((tag, index) => (
              <span key={index} className="result-tag">{tag}</span>
            ))}
          </div>

          <p className="result-date">
            Posted: {formatDate(job.date)}
          </p>

          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="result-action-btn"
          >
            Apply Now
          </a>
        </div>
      )}
    </li>
  );

  const renderArticleItem = (article) => (
    <li 
      key={article.id}
      className={`result-item article-item ${selectedItem?.id === article.id && selectedItem?.type === 'article' ? 'selected' : ''}`}
      onClick={() => setSelectedItem(selectedItem?.id === article.id ? null : { id: article.id, type: 'article' })}
    >
      {article.cover_image && (
        <img 
          src={article.cover_image} 
          alt={`${article.title} cover`} 
          className="result-logo"
        />
      )}
      
      <h3 className="result-title">{article.title}</h3>
      <p className="result-subtitle">By {article.user?.name || 'Unknown Author'}</p>
      
      <span className="result-badge article">Article</span>

      {selectedItem?.id === article.id && selectedItem?.type === 'article' && (
        <div className="result-details">
          <div className="result-description-container">
            <p className="result-description">{article.description || 'No description available'}</p>
          </div>
          
          <div className="result-tags">
            {article.tags?.map((tag, index) => (
              <span key={index} className="result-tag">{tag}</span>
            ))}
          </div>

          <p className="result-date">
            Published: {formatDate(article.published_at || article.created_at)}
          </p>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="result-action-btn"
          >
            Read Article
          </a>
        </div>
      )}
    </li>
  );

  const renderMessageItem = (message) => (
    <li 
      key={message.id}
      className={`result-item message-item ${selectedItem?.id === message.id && selectedItem?.type === 'message' ? 'selected' : ''}`}
      onClick={() => setSelectedItem(selectedItem?.id === message.id ? null : { id: message.id, type: 'message' })}
    >
      <h3 className="result-title">{message.title}</h3>
      <p className="result-subtitle">From {message.user?.name || 'Unknown Sender'}</p>
      
      <span className="result-badge message">Message</span>

      {selectedItem?.id === message.id && selectedItem?.type === 'message' && (
        <div className="result-details">
          <div className="result-description-container">
            <p className="result-description">{message.description || 'No message content available'}</p>
          </div>

          <p className="result-date">
            Received: {formatDate(message.published_at || message.created_at)}
          </p>

          <button className="result-action-btn">Reply</button>
        </div>
      )}
    </li>
  );

  const renderNetworkItem = (network) => (
    <li 
      key={network.id}
      className={`result-item network-item ${selectedItem?.id === network.id && selectedItem?.type === 'network' ? 'selected' : ''}`}
      onClick={() => setSelectedItem(selectedItem?.id === network.id ? null : { id: network.id, type: 'network' })}
    >
      {network.user?.profile_image && (
        <img 
          src={network.user.profile_image} 
          alt={`${network.user?.name} profile`} 
          className="result-logo"
        />
      )}
      
      <h3 className="result-title">{network.title || 'Network Post'}</h3>
      <p className="result-subtitle">By {network.user?.name || 'Unknown User'}</p>
      
      <span className="result-badge network">Network</span>

      {selectedItem?.id === network.id && selectedItem?.type === 'network' && (
        <div className="result-details">
          <div className="result-description-container">
            <p className="result-description">{network.description || 'No content available'}</p>
          </div>

          <p className="result-date">
            Posted: {formatDate(network.published_at || network.created_at)}
          </p>

          <div className="result-actions">
            <button className="result-action-btn">Connect</button>
            <button className="result-action-btn secondary">Message</button>
          </div>
        </div>
      )}
    </li>
  );

  const renderProfileItem = (profile) => (
    <li 
      key={profile.id}
      className={`result-item profile-item ${selectedItem?.id === profile.id && selectedItem?.type === 'profile' ? 'selected' : ''}`}
      onClick={() => setSelectedItem(selectedItem?.id === profile.id ? null : { id: profile.id, type: 'profile' })}
    >
      {profile.user?.profile_image && (
        <img 
          src={profile.user.profile_image} 
          alt={`${profile.user?.name} profile`} 
          className="result-logo profile-image"
        />
      )}
      
      <h3 className="result-title">{profile.user?.name || profile.title || 'User Profile'}</h3>
      <p className="result-subtitle">{profile.user?.username || 'No username'}</p>
      
      <span className="result-badge profile">Profile</span>

      {selectedItem?.id === profile.id && selectedItem?.type === 'profile' && (
        <div className="result-details">
          <div className="result-description-container">
            <p className="result-description">{profile.description || profile.user?.summary || 'No profile information available'}</p>
          </div>

          <div className="result-actions">
            <button className="result-action-btn">View Profile</button>
            <button className="result-action-btn secondary">Connect</button>
          </div>
        </div>
      )}
    </li>
  );

  if (!searchTerm) {
    return (
      <div className="results-container">
        <p>No search term provided.</p>
        <Link to="/" className="back-btn">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="results-container">
      <h2 className="results-header">
        {getCategoryTitle()} for "{searchTerm}"
        {category === 'jobs' && salarySort && ` (Sorted by salary: ${salarySort === 'asc' ? 'Low to High' : 'High to Low'})`}
      </h2>
      
      {loading && <div className="loading">Loading...</div>}
      
      {error && <div className="error-message">{error}</div>}

      <ul className="results-list">
        {searchResults.map(item => renderResultItem(item))}
      </ul>

      {searchResults.length === 0 && !loading && !error && (
        <div className="no-results">
          No {category === 'all' ? 'results' : category} found matching "{searchTerm}"
        </div>
      )}
      
      <Link to="/" className="back-btn">Back to Home</Link>
    </div>
  );
};

export default SearchResults;