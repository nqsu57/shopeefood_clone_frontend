import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import style from './Register.module.css'

function SignUpPage() {
    const [formData, setFormData] = useState({
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Check password match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: formData.phone,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setSuccess('Registration successful!');
                setError('');
                // Điều hướng sang trang đăng nhập
                navigate('/login');
            } else {
                setError(result.message || 'Registration failed');
            }
        } catch (err) {
            setError('Error occurred during registration');
        }
    };
    return (
        <div>
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit} className={style.container}>
                {/* <div className={style.inputgroup}>
                    <label>Phone number</label>
                    <input type="tel" placeholder="Phone number" required />
                </div> */}
                <input type="tel" placeholder="Phone number" required />
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                <input type="password" placeholder="Retype password" required />
                <button type="submit">Sign In</button>
            </form>
            <p>
                Already have an account?<Link to="/login">Sign Up</Link>
            </p>
        </div>
    );
}

export default SignUpPage;