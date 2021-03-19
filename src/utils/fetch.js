import config from "../config";

const getAccessToken = async () => {
  let accessToken = window.localStorage.getItem("access_token");
  const expires_at = window.localStorage.getItem("expires_at");
  const isValid = Date.now() < Number(expires_at) && accessToken;
  if (!isValid) {
    const res = await fetch(
      `${config.apiAccessTokenUrl}?sub=${encodeURIComponent(config.apiSub)}`
    );
    accessToken = res.access_token;
    window.localStorage.setItem("access_token", accessToken);
    window.localStorage.setItem(
      "expires_at",
      Number(res.expires_in) + Date.now()
    );
  }

  return accessToken;
};

const fetch = async (url, options = {}) => {
  const token = await getAccessToken();
  const Accept = "application/json";
  const method =
    typeof options.method === "string" ? options.method.toLowerCase() : "get";
  const defaults = {
    method,
    mode: "cors",
    credentials: "omit",
    headers: {
      Accept,
      Authorization: `Bearer ${token}`,
    },
  };

  if (method === "post" || method === "put" || method === "patch") {
    defaults.headers["Content-Type"] = Accept;
  }

  const res = await fetch(`${config.apiUrl}${url}`, {
    ...defaults,
    ...options,
    headers: {
      ...defaults.headers,
      ...options.headers,
    },
  });

  if (res.status === 200) {
    const contentType = res.headers.get("Content-Type");
    const accept = options.headers?.Accept ?? Accept;
    if (!contentType || !contentType.startsWith(accept)) {
      throw new Error(`${method} of ${url} failed to return ${accept} content`);
    }

    return accept === Accept ? res.json() : res.text();
  } else if (res.status >= 400 && res.status < 500) {
    const contentType = res.headers.get("Content-Type");
    if (contentType && contentType.startsWith(Accept)) {
      const result = await res.json();
      if (result.error_description) {
        const err = new Error(result.error_description);
        err.code = result.code;
        if (result.errors) {
          err.errors = { ...result.errors };
        }

        throw err;
      }
    }
  }

  const err = new Error(
    `${method} of ${url} returned: ${res.status} ${res.statusText}`
  );

  err.code = res.status;

  throw err;
};

export default fetch;
