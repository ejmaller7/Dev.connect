import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/Auth';

const Login = () => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { user, logIn } = useUser();
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        const loginURL = `${import.meta.env.VITE_API_URL}/api/users/login`;
        
        try {
            const response = await fetch(loginURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailOrUsername, password }),
            });

            if (response.ok) {
                // Handle case where response might be empty
                const errorText = await response.text(); 
                try {
                    const errorData = JSON.parse(errorText);
                    setError(errorData.message || 'Login attempt failed');
                } catch {
                    setError('Login attempt failed (Invalid response from server)');
                }
                return;
            }

            const text = await response.text();
            const data = text ? JSON.parse(text) : {};

            logIn(data);
            localStorage.setItem('jwtToken', data.token);
            console.log(`Welcome, ${emailOrUsername}`)
            navigate('/');

        } catch (error) {
            console.error('Error occurred during login:', error);
            setError('Something went wrong, please try again later');
        }
    };

    return (
        <div>
            <h2>{user ? `Welcome, ${emailOrUsername}!` : 'Log In'}</h2>

            {!user ? (
                <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="emailOrUsername">Email or Username</label>
                    <input
                    type="text"
                    id="emailOrUsername"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    required
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </div>

                {error && <p className="error">{error}</p>}

                <button type="submit">Log In</button>
                </form>
            ) : (
                <p>You are already signed in as {user.username}.</p>
            )}
        </div>
    );
};

export default Login;