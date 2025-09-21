import axios from 'axios';
import { showAlert } from './alert';
export const login = async (email, password) => {
  try {
    const result = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
      withCredentials: true
    });

    if (result.data.status === 'success') {
      showAlert('success', 'LoggedIn Successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 700);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const result = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
      withCredentials: true
    });
    if (result.data.status === 'success') {
      location.assign('/')
    } 
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error Logging out!, Please tyr again.');
  }
};
