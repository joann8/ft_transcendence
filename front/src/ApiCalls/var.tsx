export const api_url = process.env.REACT_APP_BACKEND_URL;

export const api_req_init: RequestInit = {
  //method: "GET",
  credentials: "include",
  referrerPolicy: "same-origin",
};
