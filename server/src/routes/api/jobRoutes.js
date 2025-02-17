const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const cors = require('cors');
router.use(cors());

router.get('/remote-jobs', async (req, res) => {
  const url = 'https://remoteok.io/api';

  try {
    console.log('Fetching data from:', url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch job data');
    }

    const jobs = await response.json();

    const filteredJobs = Array.isArray(jobs) ? jobs.slice(1) : jobs;

    const developerJobs = filteredJobs.filter(job =>
      job.position && (
        job.position.toLowerCase().includes('developer') ||
        job.position.toLowerCase().includes('engineer')
      )
    );

    console.log('Developer jobs:', developerJobs);

    res.json(developerJobs); 
  } catch (error) {
    console.error('Error fetching jobs:', error); 
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
