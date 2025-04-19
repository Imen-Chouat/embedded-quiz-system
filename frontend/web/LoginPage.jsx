import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import '../pages/LoginPage.css'; 
import signIn from './signIn.svg'; 


const LoginPage = () => {
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
          backgroundOpacity: 0.1 ,
          width: '68%'
        }}

      >
        <div className="form-wrapper">
          <h2 className="form-title">Sign In</h2>
          <p className="form-subtitle">Please login to continue to your account.</p>
         

          {/* Email Input */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="form-input"
            />
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="form-input"
            />
          </div>

          {/* Remember Me */}
          <div className="remember-me">
            <input
              id="remember"
              type="checkbox"
              className="remember-checkbox"
            />
            <label htmlFor="remember" className="remember-label">
              Keep me logged in
            </label>
          </div>

          {/* Sign In Button */}
          <button className="signin-button">
            Sign in
          </button>

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