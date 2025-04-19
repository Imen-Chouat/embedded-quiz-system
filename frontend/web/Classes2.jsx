import React from 'react';
import './Classes2.css';
import im from '../assets/import.png';

const Classes2 = () => {
  const students = [
    { id: 1, name: 'Benali Sara', grade: 14 },
    { id: 2, name: 'Hayeg Ola', grade: 16 },
    { id: 3, name: 'Zouak Syrine', grade: 16 },
    { id: 4, name: 'Farah Assia', grade: 16 },
    { id: 5, name: 'D39K254', grade: 10 },
    { id: 6, name: 'D39K253', grade: 4 },
    { id: 7, name: 'D39K252', grade: 17 },
    { id: 8, name: 'D39K251', grade: 8 },
  ];

  const handleOpen = (student) => {
    alert(`Opening details for ${student.name}`);
  };

  return (
    <div className="quiz-list-container">
      <h2 className="section-title">Start Now</h2>
      <div className="quiz-cards-container">
        <div className="button-card Import">
          <img src={im} alt="Import Students" className="imgim" />
          <div className="button-content">
            <p>Import List Of Student</p>
            <button className="btn-imp">Import</button>
          </div>
        </div>
      </div>
         
      <div className="quiz-table-container">
        <table className="quiz-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Groupe</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {students.map((Q, index) => (
              <tr key={index}>
                <td>{Q.id}</td>
                <td>{Q.name}</td>
                <td>{Q.grade}</td>
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
};

export default Classes2;
