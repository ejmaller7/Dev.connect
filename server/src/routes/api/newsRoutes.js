import express from 'express';
import fetch from 'node-fetch';  
const router = express.Router();

// get software engineering news
router.get('/news', async (req, res) => {
  try {
    const response = await fetch("https://dev.to/api/articles", {
      headers: {
        "api-key": process.env.DEV_API_KEY,  
      },
    });

    const articles = await response.json();

    if (!articles || articles.length === 0) {
      return res.status(404).json({ message: "No articles found" });
    }

    // Send the articles as a response
    res.status(200).json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
