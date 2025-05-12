// Mock API function to simulate data fetching
export const fetchQuizzes = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulated response data
        const quizzes = [
          { id: 1, title: 'Math Quiz', status: 'done' },
          { id: 2, title: 'Science Quiz', status: 'todo' },
          { id: 3, title: 'History Quiz', status: 'absent' },
        ];
        resolve({ quizzes });
      }, 2000); // Simulate a delay of 2 seconds
    });
  };
  