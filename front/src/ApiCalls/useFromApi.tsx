import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api_url, api_req_init } from "./var";
/* Tom version
const useFromApi = (url: string, init: RequestInit = api_req_init): any => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  Object.assign(api_req_init, init);

  let nav = useNavigate();
  useEffect(() => {
    fetch(api_url + url, api_req_init)
      .then((res) => {
        if (res.status === 401) {
          nav("/login");
          return;
        } else if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        setIsPending(false);
        setData(data);
      })
      .catch((err) => {
        setIsPending(false);
        setError(err.message);
      });
  }, [url]);
  return { data, isPending, error };
};
*/

//Version with async
const useFromApi = (url: string, init: RequestInit = api_req_init): any => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  Object.assign(api_req_init, init);

  let nav = useNavigate();
  useEffect(() => {
    const fecthData = async () => {
      fetch(api_url + url, api_req_init)
        .then((res) => {
          if (res.status === 401) {
            nav("/login");
            return;
          } else if (!res.ok) {
            throw new Error(res.statusText);
          }
          return res.json();
        })
        .then((data) => {
          setIsPending(false);
          setData(data);
        })
        .catch((err) => {
          setIsPending(false);
          setError(err.message);
        });
    }
    fecthData();
  }, [url]);
  return { data, isPending, error };
};


export default useFromApi;
