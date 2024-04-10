import axios from "axios";
import Cookies from "universal-cookie";
// https://appointement-scheduler-server.onrender.com

const baseUrl = "https://appointement-scheduler-server.onrender.com";

const instance = axios.create({
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

function setHeader(key, value) {
  instance.defaults.headers.common[key] = value;
}

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (!error.response || !error.response.status.toString().startsWith("2")) {
      if (error.response && error.response.status === 401) {
        const cookies = new Cookies();
        cookies.remove("token");
        cookies.remove("username");
        window.location.reload();
      }
      throw error;
    }
    return Promise.reject(error);
  }
);

const methods = {
  get: (route) => {
    return instance.get(`${baseUrl}${route.path}`, route.config);
  },
  post: (route) => {
    return instance.post(`${baseUrl}${route.path}`, route.payload);
  },
  patch: (route) => {
    return instance.patch(`${baseUrl}${route.path}`, route.payload);
  },
  delete: (route) => {
    return instance.delete(`${baseUrl}${route.path}`);
  },
  setHeader,
};

export default methods;
