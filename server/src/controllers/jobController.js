import fetch from 'node-fetch';

export const getRemoteJobs = async (req, res) => {
  const url = 'https://remoteok.com/api';

  try {
    console.log('Fetching remote job data from:', url);

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch remote job data');

    const jobs = await response.json();
    const filteredJobs = Array.isArray(jobs) ? jobs.slice(1) : jobs;

    const developerJobs = filteredJobs.filter(job =>
      job.position && (
        job.position.toLowerCase().includes('developer') ||
        job.position.toLowerCase().includes('engineer') ||
        job.position.toLowerCase().includes('software')
      )
    ).map(job => ({
      ...job,
      type: 'Remote'
    }));

    res.json(developerJobs);
  } catch (error) {
    console.error('Error fetching remote jobs:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getOnSiteJobs = async (req, res) => {
  const apiUrl = 'https://findwork.dev/api/jobs/';

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'Authorization': `Token 9868b5ad5619fe6d0d5e64c103bfb583ccc1d1de` }
    });

    if (!response.ok) throw new Error('Failed to fetch on-site job data');

    const data = await response.json();
    if (!data.results) throw new Error('No results found in API response');

    const developerJobs = data.results.filter(job =>
      job.role && (
        job.role.toLowerCase().includes('developer') ||
        job.role.toLowerCase().includes('engineer') ||
        job.role.toLowerCase().includes('software')
      )
    );

    const usLocationJobs = developerJobs.filter(job =>
      job.location && (
        job.location.toLowerCase().includes('usa') || 
        job.location.toLowerCase().includes('united states') || 
        /(?:\b[A-Z]{2}\b)/.test(job.location)
      )
    );

    const onSiteJobs = usLocationJobs.filter(job =>
      job.remote === false && 
      !job.location.toLowerCase().includes('remote')
    );

    const formattedJobs = onSiteJobs.map(job => ({
      id: job.id,
      title: job.role,
      company: job.company_name,
      location: job.location,
      url: job.url,
      date: job.date_posted,
      type: 'On-Site',
      tags: job.keywords,
      description: job.text
    }));

    res.json(formattedJobs);
  } catch (error) {
    console.error('Error fetching on-site jobs:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const remoteJobsResponse = await fetch('https://remoteok.com/api');
    const remoteJobs = await remoteJobsResponse.json();
    const filteredRemoteJobs = Array.isArray(remoteJobs) ? remoteJobs.slice(1) : remoteJobs;

    const developerRemoteJobs = filteredRemoteJobs.filter(job =>
      job.position && (
        job.position.toLowerCase().includes('developer') ||
        job.position.toLowerCase().includes('engineer') ||
        job.position.toLowerCase().includes('software')
      )
    );

    const onSiteJobsResponse = await fetch('http://localhost:5000/api/onsite-jobs'); 
    const onSiteJobs = await onSiteJobsResponse.json();

    const allJobs = [...developerRemoteJobs, ...onSiteJobs];

    res.json(allJobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: error.message });
  }
};
