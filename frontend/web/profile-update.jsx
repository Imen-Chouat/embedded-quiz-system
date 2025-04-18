import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import { useLocation, useNavigate } from 'react-router-dom';

const Chginfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { firstName: initFirstName, lastName: initLastName, email: initEmail } = location.state || {};

  const [firstName, setFirstName] = useState(initFirstName || '');
  const [lastName, setLastName] = useState(initLastName || '');
  const [email, setEmail] = useState(initEmail || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [backendPassword, setBackendPassword] = useState('password123');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);

  useEffect(() => {
    if (!location.state) {
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();

   
    localStorage.setItem('userProfile', JSON.stringify({ firstName, lastName, email }));

    setProfileUpdated(true);
    setTimeout(() => {
      setProfileUpdated(false);
      navigate('/profile'); 
    }, 1000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setPasswordUpdated(false);

    if (currentPassword === backendPassword) {
      setBackendPassword(newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setPasswordUpdated(true);
    } else {
      setErrorMessage('Current password is incorrect!');
    }
  };

  return (
    <div className='Profil-wrapper'>
      <div className="Profil-container">
        <form className="profil-form" onSubmit={handleProfileUpdate}>
          <h3>Profile Informations</h3>
          <div className="form-control">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="bottom-row">
            <button className="but-btn yellow-btn">Update FirstName</button>
          </div>
          <div className="form-control">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="bottom-row">
            <button className="but-btn yellow-btn">Update LastName</button>
          </div>

          {profileUpdated && (
            <div className="password-updated-message">
              <p style={{ color: 'green' }}>Name has been updated!</p>
            </div>
          )}
        </form>

        <form className="profil-form" onSubmit={handlePasswordChange}>
          <h3>Password</h3>
          <h5>Your email address is {email}</h5>

          <div className="form-control">
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="bottom-row">
            <button className="but-btn yellow-btn">Update password</button>
          </div>

          {passwordUpdated && (
            <div className="password-updated-message">
              <p style={{ color: 'green' }}>Password has been successfully updated!</p>
            </div>
          )}

          {errorMessage && (
            <div className="error-message">
              <p style={{ color: 'red' }}>{errorMessage}</p>
            </div>
          )}
           <div className="bottom-row">
            <button className="but-btn yellow-btn"
            onClick={()=> 
              navigate('/', {
                state:{ firstName,lastName,email}
              })
          }>Save</button>
          </div> 
        </form>
      </div>
    </div>
  );
};

export default Chginfo;

