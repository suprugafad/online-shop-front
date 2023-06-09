import axios from 'axios';

export async function checkAuthentication() {
  try {
    const response = await axios.get('http://localhost:5000/api/auth/protected', { withCredentials: true });
    console.log(response)
    return response;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return null;
  }
}

export async function checkAdmin() {
  try {
    const response = await axios.get('http://localhost:5000/api/auth/admin', { withCredentials: true });
    console.log('admin', response);
    return response;
  } catch (error) {
    console.log('Error checking authentication:', error);
    return false;
  }
}

export async function logout() {
  try {
    return await axios.post('http://localhost:5000/api/auth/logout',{}, { withCredentials: true });
  } catch (error) {
    console.error('Error checking authentication:', error);
    return null;
  }
}

export async function getUserId() {
  try {
    const response = await axios.get('http://localhost:5000/api/auth/userId', { withCredentials: true });
    return response.data.userId;
  } catch (error) {
    console.log('errrrrrrroooooorrrr')
    console.error(error);
    return [];
  }
}