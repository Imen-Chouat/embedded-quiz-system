import React, { useEffect, useState } from 'react';
import './Classes.css';

const Classes = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      //  fetch('http://localhost:5000/classes')
      const fakeData = [
        {
          className: '1CP',
          color: 'green',
          sections: [
            { section: 'Section B', groups: ['04', '05'] },
            {section: 'Section C', groups: ['06', '07', '10', '12'] }
          ]
        },
        {
          className: '2CP',
          color: 'gray',
          sections: [
            { section: 'Section B', groups: ['04', '05'] },
            {section: 'Section C', groups: ['06'] },
            {section: 'Section D', groups: ['08', '13'] }
          ]
        },
      ];

      setClasses(fakeData);
    };

    fetchData();
  }, []);

  return (
    <div className="class-container">
    <h2 className='section-title'>Classes</h2>
    <div className="class-block">
      {classes.map((cls, idx) => (
        <div className="class-row" key={idx}>
          <button className={`class-name ${cls.color}`}>{cls.className}</button>
          <div className="sections-stacked">
            {cls.sections.map((sec, i) => (
              <div className="section-row" key={i}>
                <button className="section-pill">{sec.section}</button>
                <div className="group-pills">
                  {sec.groups.map((code, j) => (
                    <button className="group-pill" key={j}>{code}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default Classes;
