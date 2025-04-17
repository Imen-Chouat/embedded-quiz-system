import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import { useNavigate } from 'react-router-dom';
const PPG = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [backendPassword, setBackendPassword] = useState('password123'); // fetch backend password
  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const [passwordUpdated, setPasswordUpdated] = useState(false); // State for success message
  const navigate = useNavigate();
  const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJtZW5UZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzQ0ODA4ODQ4LCJleHAiOjE3NDU0MTM2NDh9.theIqhtcRFSq8OgCCM6r4FEeuhuTqGUnlfcRrbJl6-k";

 useEffect(() => {
    fetch('http://10.0.3.96:5000/api/user/profile') // Adjust path if needed
      .then(res => res.json())
      .then(data => {
        setEmail(data.email);
        //setFirstName(data.firstName);
        setLastName(data.lastName);
      })
      .catch(err => console.error('Error fetching profile:', err));
      fetch('http://10.0.3.96:5000/api/teachers/getFirstName', {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${token}` 
        }, 
        body: JSON.stringify({id: 1})
      }).then(res => res.json())
      .then(data => {
        console.log(data);
        console.log(data.firstName);
        setFirstName(data.firstName);
        
      })
      .catch(err => console.error('Error fetching profile:', err));
  });



  const handlePasswordChange = (e) => {
    e.preventDefault();

    // Reset error message on new submission
    setErrorMessage('');

    // Check if current password matches the one in the backend
    if (currentPassword === backendPassword) {
      // Simulate sending the new password to the backend
      alert('Password updated successfully!');
      
      // Here, you can call your API to update the password
      setBackendPassword(newPassword); // Update the backend password with the new one

      // Optionally, reset current and new password fields
      setCurrentPassword('');
      setNewPassword('');

      // Indicate password is updated
      setPasswordUpdated(true);
    } else {
      setErrorMessage('Current password is incorrect!'); // Show error message
    }
  };
  return (
    <div className='Profil-wrapper'>
      <div className="Profil-container">
        <h2>Profile</h2>
        <form className="profil-form" onSubmit={handlePasswordChange}>
          
          <div className="form-control">
            <label>First Name</label>
            <p>{firstName}</p>
          </div>

          <div className="form-control">
            <label>Last Name</label>
            <p>{lastName}</p>
          </div>
          <div className="bottom-row">
          <button type="button"
           className="but-btn yellow-btn" 
           onClick={()=> 
            navigate('/change-info', {
              state:{ firstName,lastName,email}
            })
        }>Change Info</button>
          </div>
          <div className="form-control">
            <label>Email</label>
            <p>{email}</p>
          </div>

             <div className="bottom-row">
             <button className="but-btn red-btn">Delete Account</button>

             </div>
         
         
        </form>
      </div>
    </div>
  );
};

export default PPG;
