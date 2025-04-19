import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import '../pages/signUp.css'; 
import signUp from './signUp.svg'; 


const SignUpPage = () => {


    
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
          backgroundOpacity: 0.1 ,
          width: '68%'
        }}

      >
        <div className="form-wrapper">
          <h2 className="form-title">Sign Up</h2>
          <p className="form-subtitle">Sign up to enjoy the feature of Revolutie.</p>
         
          {/* Name Input */}
        <div className="form-group">
            <label className="form-label">Name</label>
            <input
            type="text"
            placeholder="Enter your full name"
            className="form-input"
            required
            />
        </div>

        {/* Date of Birth */}
        <div className="form-group">
            <label className="form-label">Date of Birth</label>
            <input
            type="date"
            className="form-input"
            required
            max={new Date().toISOString().split('T')[0]} // Prevent future dates
            />
        </div>

        {/* Email Input */}
        <div className="form-group">
            <label className="form-label">Email</label>
            <input
            type="email"
            placeholder="Enter your email"
            className="form-input"
            required
            />
        </div>

        {/* Password Input */}
        <div className="form-group">
            <label className="form-label">Password</label>
            <input
            type="password"
            placeholder="Create a password"
            className="form-input"
            required
            minLength="8"
            />
        </div>

          {/* Sign In Button */}
          <button className="signin-button">
          Sign up
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
            <span>Continue with Google</span>
          </button>

          {/* Sign Up Link */}
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