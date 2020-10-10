import { useState, useEffect } from "react";
import { API } from "../api-service";
import { useCookies } from "react-cookie";

function useFetch() {
  const [loggedInUser, setLoggedInUser] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [token] = useCookies(["us-token"]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError();
      const loggedInUser = await API.currentLoggedInUser(
        token["us-token"]
      ).catch((err) => setError(err));
      setLoggedInUser(loggedInUser);
      const data = await API.getUrls(token["us-token"]).catch((err) =>
        setError(err)
      );
      setData(data);
      setLoading(false);
    }
    fetchData();
  }, []);
  return [loggedInUser, data, loading, error];
}

export { useFetch };
