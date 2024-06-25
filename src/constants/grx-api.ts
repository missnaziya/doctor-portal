import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
const { REACT_APP_GRX_BASE_URL } = process.env;

let retryCount = 0; // to track retry count
let isRefreshing = false; // to stop other requests to make api call to refresh token simultaneously

// axios instance creation
const Doctor = axios.create({
  baseURL: REACT_APP_GRX_BASE_URL,
  timeout: 25000,
  headers: {
    'Content-Type': 'application/json'
  }
  // validateStatus: () => true
});

// request interceptor
Doctor.interceptors.request.use(
  async (config: any) => {
    // spinning start to show
    document.body.classList.add('loading-indicator');
    const token = window.localStorage.sessionToken;
    const refreshToken = window.localStorage.refreshToken;
    // if token exists, then add it to request header and make api call
    if (token && refreshToken) {
      config.rc = retryCount;
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      isRefreshing = false;
      logoutUser();
    }
    return config;
  },
  (error: string) => {
    document.body.classList.remove('loading-indicator');
    return Promise.reject(error);
  }
);

// response interceptor
Doctor.interceptors.response.use(
  async (response: AxiosResponse) => {
    // spinning hide
    document.body.classList.remove('loading-indicator');
    return response;
  },

  async (error: any) => {
    document.body.classList.remove('loading-indicator');

    // show error message
    if (error?.response?.status === 400) {
      toast(error?.response?.data?.message);
      return Promise.reject(error);
    }

    // get original request
    const originalRequest: any = error?.config;

    // if token is expired (444), then get the token and refresh-token and make api call to refresh token
    if (error.response?.status === 444 && originalRequest.rc < 1) {
      if (!isRefreshing) {
        const payload = {
          expiredToken: window.localStorage.sessionToken,
          refreshToken: window.localStorage.refreshToken
        };

        try {
          isRefreshing = true; // switch it to true to avoid simultaneous api call for refresh token
          // refresh token api call
          const response = await axios.post(`${REACT_APP_GRX_BASE_URL}customer/refresh-token`, payload);

          if (response.status === 201) {
            // on success set new token and refresh token into localstorage
            window.localStorage.sessionToken = response?.data?.token;
            window.localStorage.refreshToken = response?.data?.refreshToken;
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
            originalRequest.rc = originalRequest.rc + 1;
            retryCount++;
            window.location.reload();
            return Doctor(originalRequest); // retry original request
          }
        } catch (error: any) {
          if (error.response?.status === 404 || error?.response?.status === 444 || error?.response?.status === 401 || error?.response?.status === 446) {
            // if refresh token also expired, then delete the token and session info and redirect the user to login screen
            isRefreshing = false;
            logoutUser();
          }
          return Promise.reject(error);
        } finally {
          // reload the page to reinitiate api calls for failed requests
          isRefreshing = false;
          retryCount = 0;
        }
      }
    } else {
      return Promise.reject(error);
    }
  }
);

const logoutUser = () => {
  window.localStorage.removeItem('isLoggedIn');
  window.localStorage.removeItem('sessionToken');
  window.localStorage.removeItem('refreshToken');
  window.localStorage.removeItem('User');
  window.sessionStorage.removeItem('isSessionOngoing');
  window.location.replace(window?.location?.origin);
};

export default Doctor;
