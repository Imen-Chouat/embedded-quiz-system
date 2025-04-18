import React from 'react'
import {BiHome, BiSolidDashboard} from 'react-icons/bi'
import { BsGraphUp } from 'react-icons/bs'
import { MdLogout, MdQuiz, MdSettings } from 'react-icons/md'
import logo1 from '../assets/logo1.png'
import logo2 from '../assets/logo2.png'
import './Sidebar.css'
const Sidebar = () => {
  return (
    <div className='menu'>
      <div className="logo">
        <img src={logo1} alt="" className="logo1" />
        <img src={logo2} alt="" className="logo2" />
      </div>
      <div className="menu--list">
        <a href="#" className="item">
        <BiHome className='icon'/>
        Home
        </a>
        <a href="#" className="item">
        <BsGraphUp className='icon'/>
        Dashboard
        </a>
        <a href="#" className="item">
        <MdQuiz className='icon'/>
        Quizes
        </a>
        <a href="#" className="item">
        <BiSolidDashboard className='icon'/>
        Classes
        </a>
       
        <a href="#" className="item">
        <MdLogout className='icon'/>
        Log Out
        </a>
       
       
      </div>
    </div>
  )
}

export default Sidebar
