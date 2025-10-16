import axios from "axios";

const BASE_URL = 'http://localhost:8080/api/users';

class Services {
    getAuthHeader() {
        const token = localStorage.getItem('jwt');
        return {
            headers: {
                Authorization: token ? `Bearer ${token}` : ""
            }
        };
    }


    login(credentials) {
        return axios.post(`http://localhost:8080/api/auth/login`, credentials);
    }

    createAppUser(user) {
        return axios.post(`http://localhost:8080/api/auth/register`, user);
    }

    getAppUserById(userId) {
        return axios.get(`${BASE_URL}/${userId}`, this.getAuthHeader());
    }

    updatePassword(userId, oldPassword, newPassword) {
        return axios.patch(`${BASE_URL}/${userId}/password`, { oldPassword, newPassword }, this.getAuthHeader());
    }

    deleteAppUser(userId) {
        return axios.delete(`${BASE_URL}/${userId}`, this.getAuthHeader());
    }


    getAllSubscriptionsForUser(userId) {
        return axios.get(`${BASE_URL}/${userId}/subscriptions`, this.getAuthHeader());
    }

    addSubscription(subscription, userId) {
        return axios.post(`${BASE_URL}/${userId}/subscriptions`, subscription, this.getAuthHeader());
    }

    deleteSubscription(subscriptionId, userId) {
        return axios.delete(`${BASE_URL}/${userId}/subscriptions/${subscriptionId}`, this.getAuthHeader());
    }

    updateSubscription(subscription, subscriptionId, userId) {
        return axios.put(`${BASE_URL}/${userId}/subscriptions/${subscriptionId}`, subscription, this.getAuthHeader());
    }

    getSubsctiption(subscriptionId){
        return axios.get(`http://localhost:8080/api/subscriptions/${subscriptionId}`, this.getAuthHeader());
    }
}

export default new Services();