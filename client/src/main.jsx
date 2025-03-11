// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'

import React from "react";
import ReactDOM from "react-dom/client";
import App from './App.jsx'
import './css/index.css'
import { AuthProvider } from "./context/Auth"; // Adjust path if needed
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';


const client = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:5173/graphql',
  cache: new InMemoryCache(),
  headers: {
    authorization: localStorage.getItem('jwtToken') ? `Bearer ${localStorage.getItem('jwtToken')}` : "",
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
    <ApolloProvider client={client}>
        <AuthProvider>
        <App />
    </AuthProvider>
    </ApolloProvider>
)