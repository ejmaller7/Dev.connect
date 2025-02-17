import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
// import reactLogo from '../assets/react.svg'
import Home from './pages/Home';
import Jobs from './pages/Jobs'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      {/* <NavBar /> */}
      <Routes>
        <Route path="/" element={<Home />}/> 
        <Route path="/jobs" element={<Jobs />}/>
      </Routes>
      {/* <Footer /> */}
    </Router>
  )
}

export default App
