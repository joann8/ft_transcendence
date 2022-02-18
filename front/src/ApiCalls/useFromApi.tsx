import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api_url, api_req_init } from "./var";

const useFromApi = (url: string, init: RequestInit = api_req_init): any => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  Object.assign(api_req_init, init);

  let nav = useNavigate();
  useEffect(() => {
    let bol = true;
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
          if (!bol) return;
          setIsPending(false);
          setData(data);
        })
        .catch((err) => {
          if (!bol) return;
          setIsPending(false);
          setError(err.message);
        });
    };
    fecthData();
    return () => {
      bol = false;
    };
  }, [url]);
  return { data, isPending, error };
};

export default useFromApi;
