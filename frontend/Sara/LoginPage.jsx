import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import '../src/LoginPage.css'; 
import signIn from '../assets/signUp.svg'; 

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://172.20.10.2:5000/api/teachers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save tokens
      const { token, refreshToken } = data;
      
      // Store tokens based on remember me choice
      if (formData.rememberMe) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
      } else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('refreshToken', refreshToken);
      }

      // Redirect or perform other actions upon successful login
      console.log('Login successful');
      // Example: window.location.href = '/dashboard';

    } catch (error) {
      console.error('Error logging in:', error);
      setError(error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
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
          backgroundImage: `url(${signIn})`,
          backgroundSize: 'contain', 
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundOpacity: 0.1,
          width: '68%'
        }}
      >
        <div className="form-wrapper">
          <h2 className="form-title">Sign In</h2>
          <p className="form-subtitle">Please login to continue to your account.</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
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
                placeholder="Password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Remember Me */}
            <div className="remember-me">
              <input
                id="remember"
                name="rememberMe"
                type="checkbox"
                className="remember-checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="remember" className="remember-label">
                Keep me logged in
              </label>
            </div>

            {/* Sign In Button */}
            <button 
              type="submit" 
              className="signin-button"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
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
            <span>Sign in with Google</span>
          </button>

          {/* Sign Up Link */}
          <p className="signup-link">
            Need an account?{' '}
            <span className="signup-text">
              Create one
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;