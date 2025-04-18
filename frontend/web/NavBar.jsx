import React from 'react'
import './NavBar.css'
import logo1 from '../../assets/logo1.png'
import logo2 from '../../assets/logo2.png'

const NavBar = ({onHomeClick,onServiceClick,onFeaturesClick,onAboutClick}) => {
  return (
    <nav className='container'>
    <div className="logo">
      <img src={logo1} alt="logo1" className='logo1'/>
      <img src={logo2} alt="logo2" className='logo2'/>
    </div>
  
    <ul className="nav-links">
        <li><button onClick={onHomeClick} className="nav-btn">Home</button></li>
        <li><button onClick={onServiceClick} className="nav-btn">Our Service</button></li>
        <li><button onClick={onFeaturesClick} className="nav-btn">Features</button></li>
        <li><button onClick={onAboutClick} className="nav-btn">About Us</button></li>
      </ul>

  
    <div className="auth-buttons">
      <button className='btn'>Sign In</button>
      <button className='btn'>Sign Up</button>
    </div>
  </nav>
  
  
  )
}

export default NavBar; 

