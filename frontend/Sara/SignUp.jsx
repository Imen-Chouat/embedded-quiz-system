import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import '../src/SignUp.css'; 
import signUp from '../assets/signUp.svg'; 

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Basic validation
        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all required fields');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        try {
            const response = await fetch('http://172.20.10.2:5000/api/teachers/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    surname: formData.surname,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            setSuccess('Registration successful!');
            console.log('Teacher:', data.teacher);
            console.log('Message:', data.message);
            
            // You can redirect the user or clear the form here
            // setFormData({
            //     name: '',
            //     surname: '',
            //     email: '',
            //     password: ''
            // });

        } catch (error) {
            console.error('Error registering teacher:', error);
            setError(error.message || 'An error occurred during registration');
        }
    };

    return (
        <div className="login-container" style={{ 
            fontFamily: "'Inter', sans-serif",
        }}>
            {/* Left Side - Branding */}
            <div className="branding-section">
                <h1 className="brand-title">__Kouizu</h1>
                <h2 className="brand-subtitle">
                    Smart <br />
                    Assessments <br />
                    <span style={{ 
                        color: '#184F78',
                    }}>Anytime  </span> &<br />
                    Anywhere
                </h2>
            </div>

            {/* Right Side - Form */}
            <div className="form-section"
                style={{
                    backgroundImage: `url(${signUp})`,
                    backgroundSize: 'contain', 
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundOpacity: 0.1,
                    width: '68%'
                }}
            >
                <div className="form-wrapper">
                    <h2 className="form-title">Sign Up</h2>
                    <p className="form-subtitle">Sign up to enjoy the feature of Revolutie.</p>
                    
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        {/* Name Input */}
                        <div className="form-group">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                className="form-input"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Surname Input */}
                        <div className="form-group">
                            <label className="form-label">Surname</label>
                            <input
                                type="text"
                                name="surname"
                                placeholder="Enter your surname"
                                className="form-input"
                                value={formData.surname}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Email Input */}
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                className="form-input"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="8"
                            />
                        </div>

                        {/* Sign Up Button */}
                        <button type="submit" className="signin-button">
                            Sign up
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="divider">
                        <div className="divider-line"></div>
                        <span className="divider-text">or</span>
                        <div className="divider-line"></div>
                    </div>

                    {/* Google Sign In */}
                    <button className="google-button">
                        <FcGoogle className="google-icon" />
                        <span>Continue with Google</span>
                    </button>

                    {/* Sign In Link */}
                    <p className="signup-link">
                        Already have an account? {' '}
                        <span className="signup-text">
                            Sign in
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;