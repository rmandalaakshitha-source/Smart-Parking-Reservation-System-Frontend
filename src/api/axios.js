import axios from 'axios';

const API = axios.create({
  baseURL: 'https://smart-parking-backend-ag65.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
