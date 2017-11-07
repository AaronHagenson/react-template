import {
  getAccessToken
} from './auth0Middleware';
import axios from 'axios';
import config from '../config/config';

class AuthProfileApi {
  static getAuthProfile() {
    const endpoint = config.getConfig().oAuthApiEndpoint;
    const token = getAccessToken();

    let payload = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    return new Promise((resolve, reject) => {
      axios.post(`${endpoint}/userinfo`, {}, payload)
        .then(response => {
          resolve(response.data);
        })
        .catch(err => {
          reject('Error getting auth profile information ' + err);
        });
    });
  }
}

export default AuthProfileApi;
