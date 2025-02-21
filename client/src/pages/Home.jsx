import React, { useState, useEffect } from 'react';
import { useUser } from "../context/Auth";
import { useNavigate } from "react-router-dom";
import '../css/Home.css';  

const Home = () => {
  const { isAuthenticated, user } = useUser();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);  
  const [authChecked, setAuthChecked] = useState(false); 

  useEffect(() => {
    if (!authChecked) {
      setAuthChecked(true);
    } else if (!isAuthenticated) {
      navigate("/welcome");
    }
  }, [isAuthenticated, navigate, authChecked]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/news');
        const data = await response.json();
        if (response.ok) {
          setArticles(data);
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
  }, [isAuthenticated]);

  if (!authChecked) return null;

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

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
        <button className="show-more" onClick={() => setVisibleCount(prevCount => prevCount + 6)}>
          Show More
        </button>
      )}
    </div>
  );
};

export default Home;




