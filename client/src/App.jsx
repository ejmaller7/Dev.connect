import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register'
import { AuthProvider } from './context/Auth.jsx';
import SearchResults from './components/SearchResults';
import WelcomePage from './pages/WelcomePage'

function App() {

  return (
    <AuthProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}/> 
        <Route path="/jobs" element={<Jobs />}/>
        <Route path="/login" element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path="/search-results" element={<SearchResults/>}/>
        <Route path="/welcome" element={<WelcomePage />}/>
      </Routes>
      {/* <Footer /> */}
    </Router>
    </AuthProvider>
  )
}

export default App
