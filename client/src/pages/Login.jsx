import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/Auth';
import '../css/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { user, logIn } = useUser();
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        const loginURL = import.meta.env.VITE_APP_ENV === 'production' 
            ? 'https://dev-connect-invw.onrender.com/api/user/login' 
            : 'http://localhost:5000/api/user/login';
        
        try {
            const response = await fetch(loginURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }), // Removed undefined 'username'
            });
            console.log(response)
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Login attempt failed');
                return;
            }          

            const data = await response.json();

            console.log("USER: ", data)
            console.log("token: ", data.token)

            logIn(data);
            localStorage.setItem('jwtToken', data.token);
            navigate('/');

        } catch (error) {
            console.error('Error occurred during login:', error);
            setError('Something went wrong, please try again later');
        }
    };

    return (
        <div className='login-container'>
            <h2>{user ? `Welcome, ${user.username || 'User'}!` : 'Log In'}</h2>

            {!user ? (
                <form className='login-form' onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            className='login-input'
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            className='login-input'
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="error">{error}</p>}

                    <button className='login-button' type="submit">Log In</button>
                </form>
            ) : (
                <p>You are already signed in as {user.username}.</p>
            )}
        </div>
    );
};

export default Login;
