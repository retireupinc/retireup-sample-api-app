import axios from "axios";
import userAuthStorage from "./userAuthStorage";

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
  reconnectAttempted = false;

  async makeRequest(method, path, { headers = {}, params, data } = {}) {
    try {
      const res = await axios[method.toLowerCase()](formatUrl(path), {
        headers,
        params,
        data,
      });

      return res;
    } catch (err) {
      throw handleError(err);
    }
  }

  async makeAuthenticatedRequest(
    method,
    path,
    { headers = {}, params, data } = {}
  ) {
    const auth = userAuthStorage.get();
    if (!auth?.accessToken) {
      return requestNewUserAuth();
    }

    headers.Accept = "application/json";
    headers.Authorization = `Bearer ${auth.accessToken}`;

    try {
      const res = await this.makeRequest(method, path, {
        headers,
        params,
        data,
      });

      return res;
    } catch (err) {
      if (err.code !== 401) {
        throw err;
      }

      const res = await this.handleExpiredAccessToken(method, path, {
        headers,
        params,
        data,
      });

      return res;
    }
  }

  async handleExpiredAccessToken(
    method,
    path,
    { headers = {}, params, data } = {}
  ) {
    // Already attempted to reconnect, redirect user to re-authenticate
    if (this.reconnectAttempted) {
      this.reconnectAttempted = false;
      return requestNewUserAuth();
    }

    // Set to true to make sure we only try once
    this.reconnectAttempted = true;

    // Do we have existing expired auth data? if no, redirect user to re-authenticate.
    const auth = userAuthStorage.get();
    if (!auth?.accessToken) {
      return requestNewUserAuth();
    }

    // Attempt to get a new access token
    try {
      const newUserAuth = await getNewUserAuth({
        name: auth.name,
        email: auth.email,
      });

      userAuthStorage.set(newUserAuth);

      this.reconnectAttempted = false;
    } catch (err) {
      return requestNewUserAuth();
    }

    // Retry request
    const res = await this.makeAuthenticatedRequest(method, path, {
      headers,
      params,
      data,
    });

    return res;
  }
}

const client = new ApiClient();

// Makes HTTP request to fetch the new user auth info.
export const getNewUserAuth = async ({ name, email } = {}) => {
  if (typeof name !== "string") {
    throw new Error(`"name" mist be set to a string.`);
  }

  const { data } = await client.makeRequest(
    "get",
    `/token?sub=${encodeURIComponent(email)}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

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
  window.location.replace(
    `/login?returnUrl=${encodeURIComponent(window.location.href)}`
  );
  return new Promise(() => {}).catch(() => {});
};

// Fetches a household by id.
export const fetchHouseholdById = async (householdId) => {
  const { data: household } = await client.makeAuthenticatedRequest(
    "get",
    `/api/household/${householdId}`
  );
  return { household };
};

// Fetches a plan by plan id.
// Set the householdId to include the household's information.
// Set withOutcome to true to include the outcome's information.
export const fetchPlanById = async ({ planId, withOutcome = true }) => {
  const { data: plan } = await client.makeAuthenticatedRequest(
    "get",
    `/api/plan/${planId}?withOutcome=${withOutcome ? "true" : "false"}`
  );

  const { data: household } = await client.makeAuthenticatedRequest(
    "get",
    `/api/household/${plan.household}`
  );

  return { household, plan };
};

// Fetches a plan by a tag name.
// Set withOutcome to true to include the outcome's information.
export const fetchPlanByTagName = async (tagName, withOutcome = true) => {
  const { data: households } = await client.makeAuthenticatedRequest(
    "get",
    `/api/households?includePlans=true&planTag=${encodeURIComponent(tagName)}`
  );

  const filteredHouseholdPlans = [];
  households.forEach((h) => {
    h.plans.forEach((p) => {
      if (p.tags.indexOf(tagName) > -1) {
        filteredHouseholdPlans.push({
          planId: p.id,
        });
      }
    });
  });

  return fetchPlanById({ ...filteredHouseholdPlans[0], withOutcome });
};

export default client;
