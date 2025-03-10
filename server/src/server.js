import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import typeDefs from './schema/typeDefs.js';
import resolvers from './schema/resolvers.js';

dotenv.config();

import routes from './routes/index.js'

const app = express();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use(express.json()); 
app.use(cors({ origin: '*', credentials: true }));
// ['https://dev-connect-1-eiz8.onrender.com','http://localhost:5173', 'http://127.0.0.1:5173']

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [ ApolloServerPluginLandingPageLocalDefault({ embed: true }) ],
});

// Start Apollo Server before applying middleware
async function startApolloServer() {
  await server.start();
  app.use('/graphql', express.json(), expressMiddleware(server));
}

startApolloServer();

app.use(routes)

app.get('/', (req, res) => {
  res.send('Welcome to the Dev.Connect Backend API ');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));