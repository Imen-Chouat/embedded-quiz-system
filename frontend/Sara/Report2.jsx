import React, { useState, useEffect } from 'react';
import './Report.css';

const Report = ({ student, onComplete }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //const [token] = useState(localStorage.getItem('token') || sessionStorage.getItem('token')) 
  const token =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJmZ2hqX2ZnaGpAZXNpLmR6IiwiaWF0IjoxNzQ1NTgwMTYyLCJleHAiOjE3NDU1ODEwNjJ9.NamCzJ_-MraVoIwCVsHYIwn95T0mn1ZPxdnX-5RXM18";

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const studentId = student?.id || '6';
        const quizId = '9';

        const response = await fetch('http://172.20.10.3:7000/api/students/reviewQuiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            student_id: studentId,
            quiz_id: quizId
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch report data');
        }

        if (data.message === "the student did not attend this quiz.") {
          setError('This student did not attend the selected quiz.');
          setLoading(false);
          return;
        }

        const { quiz, questionNanswer } = data.quizAttempt;

        const transformedReport = {
          studentName: student?.name || 'Student',
          studentId: studentId,
          quizTitle: quiz.title,
          dateTaken: new Date().toISOString().split('T')[0],
          score: calculateScore(questionNanswer),
          totalQuestions: questionNanswer.length,
          answers: questionNanswer.map((item, index) => ({
            question: `Question ${index + 1}: ${item.question.question_text}`,
            studentAnswer: item.answer?.answer_text || 'No answer provided',
            correctAnswer: getCorrectAnswer(item.question, questionNanswer),
            isCorrect: item.answer?.is_correct || false
          }))
        };

        setReport(transformedReport);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching report:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchReportData();
  }, [student, token]);

  const calculateScore = (questions) => {
    const correctCount = questions.filter(q => q.answer?.is_correct).length;
    return Math.round((correctCount / questions.length) * 100);
  };

  const getCorrectAnswer = (question, allQuestions) => {
    const correct = allQuestions.find(q => 
      q.question.id === question.id && q.answer?.is_correct
    );
    return correct?.answer?.answer_text || 'No correct answer provided';
  };

  const handleDone = () => {
    if (onComplete) {
      onComplete();
    }
  };

  if (loading) {
    return <div className="loading-message">Loading report...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!report) {
    return <div className="no-data-message">No report data available</div>;
  }

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
        <button className="done-btn" onClick={handleDone}>Done</button>
      </div>
    </div>
  );
};

export default Report;