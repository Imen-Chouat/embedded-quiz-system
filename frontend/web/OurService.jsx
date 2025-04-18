import React from 'react';
import './OurService.css';
import assest from '../../assets/assest.png';
import notes from '../../assets/notes.png';
import certif from '../../assets/certif.png';

const OurService = () => {
  const featureList = [
    {
      icon: assest,
      title: "Easy Quiz Creation",
      description: "Intuitive interface for professors to create quizzes effortlessly."
    },
    {
      icon: notes,
      title: "Instant Distribution",
      description: "Quick sharing of quizzes via Raspberry Pi for immediate access."
    },
    {
      icon: certif,
      title: "Interactive Participation",
      description: "Students respond via their devices (laptops, phones) engagingly."
    },
  ];

  return (
    <div className="features-container">
      {featureList.map((item, index) => (
        <div className="feature" key={index}>
          <div className="feature-icon">
            <img src={item.icon} alt={item.title} />
          </div>
          <div className="feature-text">
            <h3 className="feature-title">{item.title}</h3>
            <p className="feature-description">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OurService;
