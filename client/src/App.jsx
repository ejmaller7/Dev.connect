import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Navbar from './components/Navbar';
import Footer from './components/Footer'
import Login from './pages/Login';
import Register from './pages/Register'
import { AuthProvider } from './context/Auth.jsx';
import SearchResults from './components/SearchResults';
import WelcomePage from './pages/WelcomePage'
import Profile from './pages/Profile.jsx';
import EditProfile from './pages/EditProfile.jsx';
import MessageBoard from './pages/MessageBoard.jsx'
import PrivateMessages from './pages/PrivateMessages.jsx'

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
        <Route path='/profile' element={<Profile />}/>
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/message-board" element={<MessageBoard />} />
        <Route path="/private-messages" element={<PrivateMessages />} />
      </Routes>
      <Footer />
    </Router>
    </AuthProvider>
  )
}

export default App
