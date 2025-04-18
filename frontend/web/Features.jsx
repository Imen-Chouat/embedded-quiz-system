import React from 'react'
import './Features.css'
import puzzle from '../../assets/puzzle.png'
import heart from '../../assets/heart.png'
import raspery from '../../assets/raspery.png'

const Features = () => {
  return (
    <div className='ras-container'>
      <img src={raspery} alt="Raspberry Pi" className="raspery" />
      <div className='text'> 
        <div className='heading'>
          <h2>Unique</h2>
          <h2 className='red'>Learning</h2>
          <h2>Experience</h2>
        </div>
        <div className='EA'>
          <img src={heart} alt="heart icon" className='heart'/> 
          <div className="text-block">
          <h5>Easily Accessible</h5>
          <p>Learning feels smooth and intuitive with Courslab.</p>
          </div>
          
        </div>
        <div className='FLE'>
          <img src={puzzle} alt="puzzle icon" className='puzzle'/> 
          <div className="text-block">
          <h5>Fun Learning Experience</h5>
          <p>Engaging quizzes and interactive sessions make learning fun!</p>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Features;
