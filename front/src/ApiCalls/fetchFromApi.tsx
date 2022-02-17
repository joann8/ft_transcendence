import { api_url, api_req_init } from "./var";

export async function fetchFromApi(
  url: string,
  init: RequestInit = api_req_init
): Promise<Response> {
  Object.assign(api_req_init, init);
  return fetch(api_url + url, api_req_init).then((res) => {
    return res;
  });
}
