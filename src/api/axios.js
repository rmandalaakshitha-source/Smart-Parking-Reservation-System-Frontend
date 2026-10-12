import axios from 'axios';

const API = axios.create({
  baseURL: 'https://smart-parking-reservation-system-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
