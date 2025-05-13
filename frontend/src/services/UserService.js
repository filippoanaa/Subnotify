import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

class UserService {
  login(credentials){
    return axios.post(`${API_URL}/login`, credentials);
  }
  
  createUser(user) {
    return axios.post(API_URL, user);
  }

  getUserById(userId) {
    return axios.get(`${API_URL}/${userId}`);
  }

  updatePassword(userId, newPassword) {
    return axios.put(`${API_URL}/${userId}/password`, newPassword);
  }

  deleteUser(userId) {
    return axios.delete(`${API_URL}/${userId}`);
  }
}

export default new UserService();