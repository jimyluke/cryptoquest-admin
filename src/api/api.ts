import axios from 'axios';

import { EnvironmentEnum } from '../variables/global';

export const cryptoQuestApi = axios.create({
  baseURL:
    process.env.NODE_ENV === EnvironmentEnum.DEVELOPMENT
      ? process.env.REACT_APP_DEVELOPMENT_API
      : process.env.REACT_APP_PRODUCTION_API,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
