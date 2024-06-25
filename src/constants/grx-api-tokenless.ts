import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
const { REACT_APP_GRX_BASE_URL } = process.env;

let retryCount = 0; // to track retry count
let isRefreshing = false; // to stop other requests to make api call to refresh token simultaneously

// axios instance creation
const DoctorWithoutToken = axios.create({
  baseURL: REACT_APP_GRX_BASE_URL,
  timeout: 25000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// request interceptor
DoctorWithoutToken.interceptors.request.use(
  async (config: any) => {
    // spinning start to show
    document.body.classList.add('loading-indicator');
    return config;
  },
  (error: string) => {
    document.body.classList.remove('loading-indicator');
    return Promise.reject(error);
  }
);

// response interceptor
DoctorWithoutToken.interceptors.response.use(
  async (response: AxiosResponse) => {
    // spinning hide
    document.body.classList.remove('loading-indicator');
    return response;
  },
  async (error: any) => {
    document.body.classList.remove('loading-indicator');
    // show error message
    return Promise.reject(error);
  }
);

export default DoctorWithoutToken;
