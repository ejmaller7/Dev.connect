import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Searchbar.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const navigate = useNavigate();

  // Handles changes in the search input field
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handles the search form submission
  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;

    // Call the onSearch callback if provided
    if (onSearch) {
      onSearch(searchTerm.trim(), searchCategory);
    }

    // Build the search URL with category parameter
    const searchQuery = `search=${encodeURIComponent(searchTerm.trim())}&category=${searchCategory}`;
    navigate(`/search-results?${searchQuery}`);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearchSubmit} className="search-form">
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="search-category"
        >
          <option value="all">All</option>
          <option value="messages">Messages</option>
          <option value="network">Network</option>
          <option value="jobs">Jobs</option>
          <option value="profiles">Profiles</option>
        </select>
        <input
          type="text"
          placeholder={`Search ${searchCategory === 'all' ? 'everything' : searchCategory}...`}
          value={searchTerm}
          onChange={handleInputChange}
          className="search-input"
          required
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;