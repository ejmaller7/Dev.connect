import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/Auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { user, logIn } = useUser();
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        const loginURL = import.meta.env.VITE_APP_ENV === 'production' 
            ? 'https://dev-connect-invw.onrender.com/api/login' 
            : 'http://localhost:5000/api/login';
        
        try {
            const response = await fetch(loginURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }), // Removed undefined 'username'
            });

            if (!response.ok) {
                const errorText = await response.text(); 
                try {
                    const errorData = JSON.parse(errorText);
                    setError(errorData.message || 'Login attempt failed');
                } catch {
                    setError('Login attempt failed (Invalid response from server)');
                }
                return;
            }

            const data = await response.json();

            console.log("USER: ", data);

            logIn(data);
            localStorage.setItem('jwtToken', data.token);
            navigate('/');

        } catch (error) {
            console.error('Error occurred during login:', error);
            setError('Something went wrong, please try again later');
        }
    };

    return (
        <div>
            <h2>{user ? `Welcome, ${user.username || 'User'}!` : 'Log In'}</h2>

            {!user ? (
                <form onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
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
