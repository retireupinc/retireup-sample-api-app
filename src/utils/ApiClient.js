import axios from "axios";

const methods = ["get", "post", "put", "patch", "del"];

const formatUrl = (path) => (path[0] !== "/" ? `/${path}` : path);

let accessToken;
let accessTokenExpiresAt;

const getAccessToken = async () => {
  if (!accessToken && window.localStorage.getItem("accessToken")) {
    accessToken = window.localStorage.getItem("accessToken");
    accessTokenExpiresAt = Number(
      window.localStorage.getItem("accessTokenExpiresAt")
    );
  }

  if (!accessToken || (accessToken && Date.now() >= accessTokenExpiresAt)) {
    const { data } = await axios.get("/token");
    accessToken = data.access_token;
    accessTokenExpiresAt = Number(data.expires_in) * 1000 + Date.now();
    window.localStorage.setItem("accessToken", accessToken);
    window.localStorage.setItem("accessTokenExpiresAt", accessTokenExpiresAt);
  }

  return accessToken;
};

class ApiClient {
  constructor() {
    methods.forEach((method) => {
      this[method] = (path, { headers = {}, params, data } = {}) =>
        new Promise((resolve, reject) => {
          getAccessToken()
            .then((accessToken) => accessToken)
            .then((accessToken) => {
              headers.Authorization = `Bearer ${accessToken}`;
              axios[method](formatUrl(path), { headers, params, data })
                .then(resolve)
                .catch(reject);
            });
        });
    });
  }
}

const client = new ApiClient();

export default client;
