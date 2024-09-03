import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

export default axios.create({
  baseURL: "http://localhost:5000",
});

export const axiosPrivate = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

export const refreshToken = async (): Promise<string> => {
  try {
    const { data } = await axiosPrivate.post("/auth/refreshToken");

    return data.token;
  } catch (e: any) {
    throw e;
  }
};

axiosPrivate.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = window.localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

axiosPrivate.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const { config, response } = error;

    let retry = false;
    if (response && response.status === 401 && !retry) {
      if (config) {
        retry = true;

        try {
          const token = await refreshToken();
          window.localStorage.setItem("token", token);

          if (config.headers) {
            config.headers["Authorization"] = `Bearer ${token}`;
          }

          return axiosPrivate(config);
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }

    return Promise.reject(error);
  },
);
