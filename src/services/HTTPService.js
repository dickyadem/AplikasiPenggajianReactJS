import axios from "axios";

const HTTPService = axios.create({
  timeout: 1000,
});

HTTPService.interceptors.request.use(
  (req) => {
    document.body.classList.add("loading-indicator");
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

HTTPService.interceptors.response.use(
  (res) => {
    document.body.classList.remove("loading-indicator");
    return res;
  },
  (error) => {
    if (error.response.status === 401) {
      window.location.href = "/";
    }

    if (error.response.status === 400 || error.response.status === 404) {
      if (error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert(error);
      }
    }
    document.body.classList.remove("loading-indicator");
    return Promise.reject(error);
  }
);

export default HTTPService;