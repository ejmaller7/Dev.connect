import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError('The passwords do not match');
            return;
        }
        console.log(emailOrUsername, password)

        const loginURL = `${import.meta.env.VITE_API_URL}/api/users/login`;

        try {
            const response = await fetch(loginURL, {
                
            })
        } catch (error) {
            
        }
    }
}