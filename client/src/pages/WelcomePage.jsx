import { useNavigate } from 'react-router-dom';
import '../css/WelcomePage.css'; 

const WelcomePage = () => {
    const navigate = useNavigate();

    // Handle login button click
    const handleLoginClick = () => {
        navigate('/login');
    };

    // Handle register button click
    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <div className="welcome-container">
            <h1 className="welcome-title">Welcome to Dev.connect!</h1>

            <div className="button-container">
                <button className="welcome-button" onClick={handleLoginClick}>
                    Log In
                </button>
                <button className="welcome-button" onClick={handleRegisterClick}>
                    Register
                </button>
            </div>
        </div>
    );
};

export default WelcomePage;

