import React, { useState, useEffect } from 'react';
import '../css/Home.css';  

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);  

  // Fetch articles when the component mounts
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/news');
        const data = await response.json();

        if (response.ok) {
          setArticles(data);  // Set the articles state
        } else {
          console.error(data.message);  
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);  
      }
    };

    fetchArticles();
  }, []);

  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Handle "Show More" click to reveal more articles
  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 6);  
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Software Engineering News</h1>
      <div className="article-container">
        {articles.slice(0, visibleCount).map((article) => (
          <div key={article.id} className="article-item">
            <h2 className="article-title">{article.title}</h2>
            <p className="article-description">{article.description}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">
              Read More
            </a>
            <img src={article.social_image} alt={article.title} className="article-image" />
            <div className="publish-info">
              <small>Published on {article.readable_publish_date}</small>
            </div>
          </div>
        ))}
      </div>
      {visibleCount < articles.length && (
        <button className="show-more" onClick={handleShowMore}>
          Show More
        </button>
      )}
    </div>
  );
};

export default Home;


