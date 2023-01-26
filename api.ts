import axios from 'axios';

const ApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ALCHEMY_URL,
  headers: {
    'Content-type': 'application/json',
    Accept: 'application/json',
  },
});

export default ApiClient;
