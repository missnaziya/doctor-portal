import axios, { AxiosRequestConfig } from "axios";

import { AxiosHeadersInterface } from "../interfaces/axoisHeader";

const BASE_URL = "https://mobileauth.imprimisrx.com/development/webservices/1.0.7/index.php";
const Slider = axios.create({
  baseURL: BASE_URL,
  timeout: 25000,
  headers: {
    "Content-Type": "application/json",
  },
});
// console.log(BASE_URL,'HHH');

 Slider.interceptors.request.use((config: any) => {

  document.body.classList.add('loading-indicator');

  const token = window.localStorage.token;
  if (token) {
    if(config?.headers){
     (config.headers as AxiosHeadersInterface).Authorization = `token ${token}`
    }
  }
  return config;
}, (error) => {
  document.body.classList.remove('loading-indicator');
  return Promise.reject(error);
});
 Slider.interceptors.response.use(function (response) {

  document.body.classList.remove('loading-indicator');

  return response;
}, function (error) {
  document.body.classList.remove('loading-indicator');
  return Promise.reject(error);
});

export default Slider;
