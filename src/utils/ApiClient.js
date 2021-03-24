import axios from "axios";
import { DEFAULT_USER_AUTH, USER_AUTH_LOCAL_STORAGE_KEY } from "../constants";

// Supported API Http Methods
const methods = ["get", "post", "put", "patch", "del"];

// Prepends all paths with a "/"
const formatUrl = (path) => (path[0] !== "/" ? `/${path}` : path);

// Handles the Axios response error and returns a normalized Error object.
const handleError = (originalError) => {
  const error = new Error("The request failed.");
  error.code = originalError.response?.status ?? 500;
  error.error =
    originalError.response?.data?.error_description ??
    originalError.response?.statusTex;
  error.error_description =
    typeof originalError.response?.data === "string"
      ? originalError.response?.data
      : originalError.response?.data?.error_description ??
        "The request failed.";

  if (originalError.response?.data?.errors) {
    error.errors = originalError.response.data.errors;
  }

  return error;
};

// Http client to make calls to the Retireup API.
class ApiClient {
  constructor() {
    methods.forEach((method) => {
      this[method] = (path, { headers = {}, params, data } = {}) =>
        new Promise((resolve, reject) => {
          // Set Bearer token for all /api routes
          if (path.startsWith("/api")) {
            const auth = getStoredUserAuth();
            if (!auth?.isAuthenticated) {
              return requestNewUserAuth()
                .then(resolve)
                .catch((err) => {
                  reject(handleError(err));
                });
            }

            headers.Accept = "application/json";
            headers.Authorization = `Bearer ${auth.accessToken}`;
          }

          axios[method](formatUrl(path), { headers, params, data })
            .then(resolve)
            .catch((originalError) => {
              const err = handleError(originalError);
              if (err.code === 401) {
                requestNewUserAuth()
                  .then(resolve)
                  .catch((authErr) => {
                    reject(handleError(authErr));
                  });
              } else {
                reject(err);
              }
            });
        });
    });
  }
}

const client = new ApiClient();

// Gets the user auth info from the local storage.
export const getStoredUserAuth = () => {
  const authStr = window.localStorage.getItem(USER_AUTH_LOCAL_STORAGE_KEY);
  if (!authStr) {
    return { ...DEFAULT_USER_AUTH };
  }

  let auth;
  try {
    auth = JSON.parse(authStr);
  } catch (err) {}

  if (
    !auth ||
    typeof auth !== "object" ||
    auth.accessTokenExpiresAt <= Date.now()
  ) {
    window.localStorage.removeItem(USER_AUTH_LOCAL_STORAGE_KEY);
    return { ...DEFAULT_USER_AUTH };
  }

  return {
    ...auth,
    isAuthenticated: true,
  };
};

// Makes HTTP request to fetch the new user auth info.
export const getNewUserAuth = async ({ name, email }) => {
  const { data } = await client.get(`/token?sub=${encodeURIComponent(email)}`, {
    headers: {
      Accept: "application/json",
    },
  });

  return {
    name,
    email,
    accessToken: data.access_token,
    accessTokenExpiresAt: Number(data.expires_in) * 1000 + Date.now(),
    isAuthenticated: true,
  };
};

// Forces user to login and request new user auth info.
export const requestNewUserAuth = async () => {
  window.localStorage.removeItem(USER_AUTH_LOCAL_STORAGE_KEY);
  window.location.replace(
    `/login?returnUrl=${encodeURIComponent(window.location.href)}`
  );
  return new Promise(() => {}).catch(() => {});
};

// Fetches a household by id.
export const fetchHouseholdById = async (householdId) => {
  const { data: household } = await client.get(`/api/household/${householdId}`);
  return { household };
};

// Fetches a plan by plan id.
// Set the householdId to include the household's information.
// Set withOutcome to true to include the outcome's information.
export const fetchPlanById = async ({
  planId,
  householdId,
  withOutcome = true,
}) => {
  if (householdId) {
    const promises = [
      client.get(
        `/api/plan/${planId}?withOutcome=${withOutcome ? "true" : "false"}`
      ),
      client.get(`/api/household/${householdId}`),
    ];

    const results = await Promise.all(promises);
    return { household: results[1].data, plan: results[0].data };
  }

  const { data: plan } = await client.get(
    `/api/plan/${planId}?withOutcome=${withOutcome ? "true" : "false"}`
  );

  const { data: household } = await client.get(`/api/household/${householdId}`);

  return { household, plan };
};

// Fetches a plan by a tag name.
// Set withOutcome to true to include the outcome's information.
export const fetchPlanByTagName = async (tagName, withOutcome = true) => {
  const { data: households } = await client.get(
    `/api/households?includePlans=true&planTag=${encodeURIComponent(tagName)}`
  );

  const filteredHouseholds = [];
  households.forEach((h) => {
    h.plans.forEach((p) => {
      if (p.tags.indexOf(tagName) > -1) {
        filteredHouseholds.push({
          householdId: h.id,
          planId: p.id,
        });
      }
    });
  });

  return fetchPlanById({ ...filteredHouseholds[0], withOutcome });
};

export default client;
