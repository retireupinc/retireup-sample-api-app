import axios from "axios";

const methods = ["get", "post", "put", "patch", "del"];

const formatUrl = (path) => (path[0] !== "/" ? `/${path}` : path);

let accessToken;
const getAccessToken = async () => {
  if (!accessToken && window.localStorage.getItem("accessToken")) {
    accessToken = {
      accessToken: window.localStorage.getItem("accessToken"),
      expiresAt: Number(window.localStorage.getItem("accessTokenExpiresAt")),
    };
  }

  if (!accessToken || (accessToken && Date.now() >= accessToken.expiresAt)) {
    const { data } = await axios.get("/token");
    accessToken = {
      accessToken: data.access_token,
      expiresAt: Number(data.expires_in) * 1000 + Date.now(),
    };
    window.localStorage.setItem("accessToken", accessToken.accessToken);
    window.localStorage.setItem("accessTokenExpiresAt", accessToken.expiresAt);
  }

  return accessToken.accessToken;
};

class ApiClient {
  constructor() {
    methods.forEach((method) => {
      this[method] = (path, { headers = {}, data } = {}) =>
        new Promise((resolve, reject) => {
          getAccessToken()
            .then((accessToken) => accessToken)
            .then((accessToken) => {
              headers.Authorization = `Bearer ${accessToken}`;
              axios[method](formatUrl(path), { headers })
                .then(resolve)
                .catch(reject);
            });
        });
    });
  }
}

const client = new ApiClient();

export default client;
