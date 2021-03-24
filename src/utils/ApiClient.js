import axios from "axios";
import { DEFAULT_USER_AUTH, USER_AUTH_LOCAL_STORAGE_KEY } from "../constants";

// Supported API Http Methods
const methods = ["get", "post", "put", "patch", "del"];

const formatUrl = (path) => (path[0] !== "/" ? `/${path}` : path);

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
              return requestNewUserAuth().then(resolve).catch(reject);
            }

            headers.Accept = "application/json";
            headers.Authorization = `Bearer ${auth.accessToken}`;
          }

          axios[method](formatUrl(path), { headers, params, data })
            .then(resolve)
            .catch((err) => {
              if (err.response?.status === 401) {
                requestNewUserAuth().then(resolve).catch(reject);
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
  if (authStr) {
    const auth = JSON.parse(authStr);
    if (Date.now() < auth.accessTokenExpiresAt) {
      return {
        ...auth,
        isAuthenticated: true,
      };
    }
  }

  return { ...DEFAULT_USER_AUTH };
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
