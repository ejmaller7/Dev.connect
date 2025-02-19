import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Searchbar.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const [salarySort, setSalarySort] = useState('');
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
      onSearch(searchTerm.trim(), searchCategory, salarySort);
    }

    // Build the search URL with category and salary sort parameters
    const searchQuery = new URLSearchParams({
      search: searchTerm.trim(),
      category: searchCategory,
      ...(salarySort && { salary_sort: salarySort })
    }).toString();

    navigate(`/search-results?${searchQuery}`);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearchSubmit} className="search-form">
        <div className="flex flex-row gap-2 items-center">
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

          {searchCategory === 'jobs' && (
            <select
              value={salarySort}
              onChange={(e) => setSalarySort(e.target.value)}
              className="salary-sort"
            >
              <option value="">Sort by salary</option>
              <option value="asc">Lowest to Highest</option>
              <option value="desc">Highest to Lowest</option>
            </select>
          )}

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
        </div>
      </form>
    </div>
  );
};

export default SearchBar;