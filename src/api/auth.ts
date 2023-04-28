import axios from 'axios';

export async function checkAuthentication() {
  try {
    const response = await axios.get('http://localhost:5000/api/auth/protected', { withCredentials: true });
    return response.data.user;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return null;
  }
}

export async function logout() {
  try {
    return await axios.post('http://localhost:5000/api/auth/logout', { withCredentials: true });
  } catch (error) {
    console.error('Error checking authentication:', error);
    return null;
  }
}