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
          getAccessToken().then((accessToken) => {
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
