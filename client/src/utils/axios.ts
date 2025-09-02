import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

let accessToken: string | null = null;
let logoutCallback: (() => void) | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = (): string | null => accessToken;

export const setLogoutCallback = (cb: () => void) => {
  logoutCallback = cb;
};

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error("VITE_API_URL variable in .env file is required");
}

export default axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const refreshToken = async (): Promise<string> => {
  try {
    const { data } = await api.post("/auth/refreshToken");

    return data.token;
  } catch (e: any) {
    throw e;
  }
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
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
          setAccessToken(token);

          if (config.headers) {
            config.headers["Authorization"] = `Bearer ${token}`;
          }

          return api(config);
        } catch (e) {
          if (logoutCallback) logoutCallback();
          return Promise.reject(e);
        }
      }
    }

    return Promise.reject(error);
  }
);
