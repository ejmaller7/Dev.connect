import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Welcome to Dev.Connect</h1>
      <p>This is the homepage. Click the link below to test navigation.</p>
      <Link to="/jobs">
        <button>Go to Jobs Page</button>
      </Link>
    </div>
  );
};

export default Home;
