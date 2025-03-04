import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import PostBoard from './pages/Home';
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
// import MessageBoard from './pages/MessageBoard.jsx'
import Messages from './pages/Messages.jsx'
import News from './pages/News.jsx'
import Network from './pages/Network.jsx';

function App() {

  return (
    <AuthProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<PostBoard />}/> 
        <Route path="/jobs" element={<Jobs />}/>
        <Route path="/login" element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path="/search-results" element={<SearchResults/>}/>
        <Route path="/welcome" element={<WelcomePage />}/>
        <Route path='/profile' element={<Profile />}/>
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/news" element={<News />}/>
        <Route path='/network' element={<Network />}/>
      </Routes>
      <Footer />
    </Router>
    </AuthProvider>
  )
}

export default App
