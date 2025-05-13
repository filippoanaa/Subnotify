import axios from "axios";

const BASE_URL = 'http://localhost:8080/api';

class SubscriptionService {
    getSubscription(subscriptionId) {
        return axios.get(`${BASE_URL}/subscriptions/${subscriptionId}`); // Obține o subscripție specifică
    }

    getUsersSubscriptions(userId) {
        return axios.get(`${BASE_URL}/users/${userId}/subscriptions`); // Obține subscripțiile unui utilizator
    }

    addSubscription(subscription, userId) {
        return axios.post(`${BASE_URL}/users/${userId}/subscriptions`, subscription); // Adaugă o subscripție pentru un utilizator
    }

    deleteSubscription(subscriptionId, userId) {
        return axios.delete(`${BASE_URL}/users/${userId}/subscriptions/${subscriptionId}`); // Șterge o subscripție a unui utilizator
    }

    updateSubscription(subscription, subscriptionId, userId) {
        return axios.put(`${BASE_URL}/users/${userId}/subscriptions/${subscriptionId}`, subscription); // Actualizează o subscripție
    }

    getSubscriptionsDueSoon(userId) {
        return axios.get(`${BASE_URL}/users/${userId}/subscriptions/paymentDueSoon`); // Obține subscripțiile cu plată iminentă
    }
    
}

export default new SubscriptionService();