import React from 'react';
import './Home.css';
import avatar from '../../assets/avatar.png';

const Home = () => {
  return (
    <div className='descrp'>
      <div className='descrp-left'>
        <div className='descrp-text'>
          <h1><span className='red'>Smart</span> <span className='blk'>Assessments</span></h1>
          <h1><span className='grn'>Anywhere</span> <span className='blk'>Anytime</span></h1>

          <p className='descrp-text1'>
            Design and share unlimited quizzes with full creative freedom, host them offline via Raspberry Pi for seamless student access, and analyze real-time results with intuitive dashboards to track performance and refine teaching strategies.
          </p>

         
        </div>
      </div>

      <div className='descrp-right'>
        <img src={avatar} alt="avatar" className='avatar' />
      </div>
    </div>
  );
};

export default Home;
