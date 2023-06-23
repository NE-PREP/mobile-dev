import axios from "axios";

const API_URL = 'http://192.168.8.101:4000';
export default API_URL;


export const sendRequest = async (api, method, payload = {}) => {
    const headers = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    
    try {
      if (method === 'GET') {
        const response = await axios.get(api, headers);
        return response;
      } else if (method === 'POST') {
        const response = await axios.post(api, payload, headers);
        return response;
      } else if (method === 'PUT') {
        const response = await axios.put(api, payload, headers);
        return response;
      } else if (method === 'DELETE') {
        const response = await axios.delete(api, headers);
        return response;
      }
    } catch (error) {
      console.error('Error occurred during request:', error);
      throw error;
    }
  };
  