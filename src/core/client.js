import axios from "axios";
import Cookies from "universal-cookie";
import { SubmitLoginWithRefreshToken } from "../repository/auth";
// https://appointement-scheduler-server.onrender.com/api

const baseUrl = "https://appointement-scheduler-server.onrender.com/api";

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
  async function (error) {
    if (!error.response || !error.response.status.toString().startsWith("2")) {
      if (error.response && error.response.status === 401) {
        const cookies = new Cookies();
        const refreshToken = cookies.get("refreshToken");
        if (refreshToken && refreshToken !== "") {
          try {
            const response = await SubmitLoginWithRefreshToken({
              refreshToken: refreshToken,
            });
            const cookies = new Cookies();
            cookies.set("token", response.token, {
              path: "/",
              maxAge: 3600 * 3,
            });
            cookies.set("refreshToken", response.refreshToken, {
              path: "/",
              maxAge: 3600 * 30,
            });
            window.location.reload();
          } catch (error) {
            console.log(error);
            cookies.remove("token");
            cookies.remove("username");
            cookies.remove("refreshToken");
            window.location.reload();
          }
        } else {
          cookies.remove("token");
          cookies.remove("username");
          cookies.remove("refreshToken");
          window.location.reload();
        }
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
