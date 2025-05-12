import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to save mock data
export const saveMockData = async () => {
  try {
    const mockData = {
      quizzes: [{ title: 'Quiz 1', id: 1 }, { title: 'Quiz 2', id: 2 }],
      grades: [{ quizId: 1, grade: 80 }],
    };
    await AsyncStorage.setItem('mockData', JSON.stringify(mockData));
    console.log('Mock data saved');
  } catch (error) {
    console.error('Error saving mock data:', error);
  }
};

// Function to fetch mock data
export const fetchMockData = async () => {
  try {
    const data = await AsyncStorage.getItem('mockData');
    if (data !== null) {
      console.log('Mock data loaded:', JSON.parse(data));
    } else {
      console.log('No mock data found');
    }
  } catch (error) {
    console.error('Error fetching data from AsyncStorage:', error);
  }
};
