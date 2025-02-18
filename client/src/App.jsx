import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
// import reactLogo from '../assets/react.svg'
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import { UserProvider } from './context/UserContext';

function App() {
  const [count, setCount] = useState(0)

  return (
    <UserProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}/> 
        <Route path="/jobs" element={<Jobs />}/>
        <Route path="/login" element={<Login />}/>
      </Routes>
      {/* <Footer /> */}
    </Router>
    </UserProvider>
  )
}

export default App
