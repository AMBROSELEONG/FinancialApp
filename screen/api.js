import axios from 'axios';

const API_KEY = 'AIzaSyDnsfL5qcb-xTi27Yfj3OvVl7KkEtWWFb4'; 
const API_URL = 'https://gemini.googleapis.com/v1/text-embedding-004/us-central1-aiplatform.googleapis.com'; 

export const fetchGeminiData = async (requestParams) => {
  try {
    const response = await axios.post(
      API_URL,
      requestParams,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching Gemini data:', error.response ? error.response.data : error.message);
    throw error;
  }
};
