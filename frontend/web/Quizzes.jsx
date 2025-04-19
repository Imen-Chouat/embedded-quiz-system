import React, { useState } from 'react';
import './ProfilePage.css';
import ct from '../assets/create.png';
import im from '../assets/import.png';
import ai from '../assets/ai.png';

function QuizList() {
  const [activeTab, setActiveTab] = useState('ALL'); 
  const [quizzes, setQuizzes] = useState([]); 
 
  const allData = [
    { Date: '28/02/2025', name: 'ARCHICHP1', module: 'Archi' },
    { Date: '25/03/2025', name: 'SYS-1', module: 'Sys' },
    { Date: '01/04/2025', name: 'PYTHON', module: 'OOP' },
    { Date: '15/04/2025', name: 'POO', module: 'OOP' },
  ];

  const pastData = [
    { Date: '28/02/2025', name: 'ARCHICHP1', module: 'Archi' },
    { Date: '25/03/2025', name: 'SYS-1', module: 'Sys' },
  ];

  const draftData = [
    { Date: '01/04/2025', name: 'PYTHON', module: 'OOP' },
    { Date: '15/04/2025', name: 'POO', module: 'OOP' },
  ];

  // Change data based on the tab clicked
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'ALL') setQuizzes(allData);
    if (tab === 'PAST') setQuizzes(pastData);
    if (tab === 'DRAFT') setQuizzes(draftData);
  };
    /*useEffect(() => {
    // Méthode avec fetch
    fetch('http://localhost:5000/api/quizzes') 
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erreur de chargement');
        }
        return res.json();
      })
      .then((data) => {
        setQuizzes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Impossible de charger les quiz');
        setLoading(false);
      });
  }, []);*/

  return (
    <div className="quiz-list-container">
      <h2 className='section-title'>Start Now</h2>
      <div className="quiz-cards-container">
        <div className='button-card Create'>
          <img src={ct} alt="" className="imgcrt" />
          <div className="button-content">
          <p>Create Quiz</p>
            <button className="btn-crt">Create</button>
          </div>
        </div>
        <div className='button-card Import'>
          <img src={im} alt="" className="imgim" />
          <div className="button-content">
          <p>Import Quiz</p>
            <button className="btn-imp">Import</button>
          </div>
        </div>
        <div className='button-card Generate'>
          <img src={ai} alt="" className="imgai" />
          <div className="button-content">
          <p>Generate With AI</p>
            <button className="btn-gnt">Generate</button>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={activeTab === 'ALL' ? 'tab-active' : 'tab'}
          onClick={() => handleTabClick('ALL')}
        >
          ALL
        </button>
        <button
          className={activeTab === 'PAST' ? 'tab-active' : 'tab'}
          onClick={() => handleTabClick('PAST')}
        >
          PAST
        </button>
        <button
          className={activeTab === 'DRAFT' ? 'tab-active' : 'tab'}
          onClick={() => handleTabClick('DRAFT')}
        >
          DRAFT
        </button>
      </div>
      <hr />
      
      <div className="quiz-table-container">
        <table className="quiz-table">
          <thead>
            <tr>
              <th>Quiz Date</th>
              <th>Quiz Name</th>
              <th>Module</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((Q, index) => (
              <tr key={index}>
                <td>{Q.Date}</td>
                <td>{Q.name}</td>
                <td>{Q.module}</td>
                <td>
                  <button className="open-btn">Open</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default QuizList;
