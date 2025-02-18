// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'

import React from "react";
import ReactDOM from "react-dom/client";
import App from './App.jsx'
import './css/index.css'
import { AuthProvider } from "./context/Auth"; // Adjust path if needed

ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <App />
    </AuthProvider>
)