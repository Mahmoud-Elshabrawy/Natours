import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updatePassword'
        : '/api/v1/users/updateMe';
    const result = await axios({
      method: 'PATCH',
      url,
      data,
      withCredentials: true
    });

    if (result.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} Updated Successfully`);
      window.setTimeout(() => {
        location.reload()
      }, 700);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
