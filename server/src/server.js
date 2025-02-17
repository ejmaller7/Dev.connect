require('dotenv').config(); 

const express = require('express');
const cors = require('cors');

const jobsRoutes = require('./routes/api/jobRoutes'); 

const app = express();

app.use(express.json()); 
app.use(cors());

app.use('/api', jobsRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Dev.Connect Backend API ');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
