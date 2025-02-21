import { useState } from 'react';
import Login from './Login';
import Register from './Register';

const LandingPage = () => {
    // Toggle between login and register
    const [isLogin, setIsLogin] = useState(true);
    
    return (
        <div>
            <h1>Welcome to Dev.connect!</h1>

            <div>
                <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>Log In</button>
                <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>Register</button>
            </div>

            <div>
                {isLogin ? <Login /> : <Register />}
            </div>
        </div>
    );
};

export default LandingPage;