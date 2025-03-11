import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import PostBoard from './pages/Home';
import Jobs from './pages/Jobs';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/Auth.jsx';
import SearchResults from './components/SearchResults';
import WelcomePage from './pages/WelcomePage';
import Profile from './pages/Profile.jsx';
import EditProfile from './pages/EditProfile.jsx';
import PrivateMessages from './pages/PrivateMessages.jsx';
import PrivateMessageConversation from './pages/PrivateMessageConvo.jsx';
import News from './pages/News.jsx';
import Network from './pages/Network.jsx';

const client = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:5173/graphql',
  cache: new InMemoryCache(),
  headers: {
    authorization: localStorage.getItem('jwtToken') ? `Bearer ${localStorage.getItem('jwtToken')}` : "",
  },
});

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<PostBoard />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/login" element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path='/profile' element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/messages" element={<PrivateMessages />} />
            <Route path="/messages/:userId" element={<PrivateMessageConversation />} />
            <Route path="/news" element={<News />} />
            <Route path='/network' element={<Network />} />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
