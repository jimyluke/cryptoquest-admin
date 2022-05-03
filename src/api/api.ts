import axios from 'axios';

export const cryptoQuestApi = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_PRODUCTION_API
      : process.env.REACT_APP_DEVELOPMENT_API,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
