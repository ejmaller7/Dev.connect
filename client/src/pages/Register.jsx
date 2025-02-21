import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!username || !email || !password) {
            setError('All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            setError('The passwords do not match.');
            return;
        }

        console.log("Registering:", { username, email, password });

        const registerURL = import.meta.env.VITE_APP_ENV === 'production'
            ? 'https://dev-connect-invw.onrender.com/api/register'
            : 'http://localhost:5000/api/register';

        try {
            const response = await fetch(registerURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password })  // Sending correctly formatted request
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Account created with ID:', data.userId);
          
                setSuccess('Account created successfully!');
                setUsername('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setError('');

                setTimeout(() => navigate('/login'), 2000);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to create account');
            }
        } catch (error) {
            console.error('Error creating account:', error);
            setError('Something went wrong, please try again later.');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

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

                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <button type="submit">Register Account</button>
            </form>
        </div>
    );
};

export default Register;
