import axios from 'axios';
import { API_BASE_URL } from '@/config/serverApiConfig';
import storePersist from '@/redux/storePersist';

export const getCustomerLocations = async () => {
  try {
    const auth = storePersist.get('auth');
    const headers = {};
    if (auth && auth.current && auth.current.token) {
      headers['Authorization'] = `Bearer ${auth.current.token}`;
    }

    const response = await axios.get(`${API_BASE_URL}client/listWithLocation`, {
      params: {
        limit: 1000 // Get all locations
      },
      headers: headers
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching customer locations:', error);
    return [];
  }
};
