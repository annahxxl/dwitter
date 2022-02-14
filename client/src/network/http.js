import axios from "axios";
import axiosRetry from "axios-retry";

const defaultRetryConfig = {
  retries: 5,
  initialDelayMs: 100,
};
export default class HttpClient {
  constructor(
    baseURL,
    authErrorEventBus,
    getCsrfToken,
    config = defaultRetryConfig
  ) {
    this.authErrorEventBus = authErrorEventBus;
    this.getCsrfToken = getCsrfToken;
    this.client = axios.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    axiosRetry(this.client, {
      retries: config.retries,
      retryDelay: (retry) => {
        const delay = Math.pow(2, retry) * config.initialDelayMs; // 100, 200, 400, 800, 1600 ...
        const jitter = delay * 0.1 * Math.random();
        return delay + jitter;
      },
      retryCondition: (error) =>
        axiosRetry.isNetworkOrIdempotentRequestError(error) ||
        error.response.status === 429,
    });
  }

  async fetch(url, options) {
    const { body, method, headers } = options;
    const req = {
      url,
      method,
      headers: {
        ...headers,
        "dwitter-csrf-token": this.getCsrfToken(),
      },
      data: body,
    };

    try {
      const res = await this.client(req);
      return res.data;
    } catch (error) {
      if (error.response) {
        const data = error.response.data;
        const message =
          data && data.message ? data.message : "Something went wrong";
        throw new Error(message);
      }
      throw new Error("connection error");
    }
  }
}
