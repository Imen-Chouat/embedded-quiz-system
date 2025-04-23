import React, { useState, useEffect } from 'react';
import './Report.css';

const Report = ({ student }) => {
  // Sample report data - replace with your actual data
  const [report, setReport] = useState({
    studentName: 'John Doe',
    studentId: 'S12345',
    quizTitle: 'Computer Science Fundamentals',
    dateTaken: '2023-05-15',
    score: 82,
    totalQuestions: 15,
    answers: Array.from({ length: 15 }, (_, i) => ({
      question: `Question ${i + 1}: ${[
        'What does CPU stand for?',
        'Which language runs in a web browser?',
        'What is the time complexity of binary search?',
        'Which data structure uses FIFO principle?',
        'What does HTML stand for?',
        'Which protocol is used for secure web communication?',
        'What is the main purpose of an operating system?',
        'Which sorting algorithm has O(n log n) average time complexity?',
        'What is a primary key in databases?',
        'What does CSS stand for?',
        'What is the difference between == and === in JavaScript?',
        'What is the purpose of DNS?',
        'What does API stand for?',
        'What is object-oriented programming?',
        'What is the difference between TCP and UDP?'
      ][i]}`,
      studentAnswer: [
        'Central Processing Unit',
        'Java',
        'O(log n)',
        'Stack',
        'Hypertext Markup Language',
        'HTTP',
        'To manage hardware resources',
        'Bubble sort',
        'A unique identifier for each record',
        'Cascading Style Sheets',
        'No difference',
        'To translate domain names to IP addresses',
        'Application Programming Interface',
        'A programming paradigm based on objects',
        'TCP is connectionless'
      ][i],
      correctAnswer: [
        'Central Processing Unit',
        'JavaScript',
        'O(log n)',
        'Queue',
        'Hypertext Markup Language',
        'HTTPS',
        'To manage hardware resources',
        'Merge sort',
        'A unique identifier for each record',
        'Cascading Style Sheets',
        '== compares values, === compares values and types',
        'To translate domain names to IP addresses',
        'Application Programming Interface',
        'A programming paradigm based on objects',
        'TCP is connection-oriented'
      ][i],
      isCorrect: [
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        true,
        false,
        true,
        true,
        true,
        false
      ][i]
    }))
  });

  return (
    <div className="student-report-container">
      <div className="report-header">
        <h2>{report.studentName}'s Quiz Report</h2>
        <div className="report-meta">
          <span>Quiz: {report.quizTitle}</span>
          <span>Date: {new Date(report.dateTaken).toLocaleDateString()}</span>
          <span className={`overall-score ${report.score >= 80 ? 'high' : report.score >= 60 ? 'medium' : 'low'}`}>
            Score: {report.score}% ({Math.round(report.totalQuestions * report.score / 100)}/{report.totalQuestions})
          </span>
        </div>
      </div>

      <div className="answers-scroll-container">
        <div className="answers-list">
          {report.answers.map((answer, index) => (
            <div key={index} className={`answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
              <div className="question">
                <span className="question-number">Q{index + 1}:</span>
                {answer.question.split(':')[1]}
              </div>
              <div className="student-answer">
                <strong>Student's answer:</strong> {answer.studentAnswer}
              </div>
              {!answer.isCorrect && (
                <div className="correct-answer">
                  <strong>Correct answer:</strong> {answer.correctAnswer}
                </div>
              )}
              <div className="answer-status">
                {answer.isCorrect ? (
                  <span className="correct-icon">✓ Correct</span>
                ) : (
                  <span className="incorrect-icon">✗ Incorrect</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="report-actions">
        <button className="print-btn">Print Report</button>
        <button className="export-btn">Export as PDF</button>
      </div>
    </div>
  );
};

export default Report;