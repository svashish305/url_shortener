import React, { useState, useEffect } from "react";
import "./App.css";
import UrlList from "./components/url-list";
import UrlDetails from "./components/url-details";
import UrlForm from "./components/url-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useCookies } from "react-cookie";
import { useFetch } from "./hooks/useFetch";

function App() {
  const [urls, setUrls] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [editedUrl, setEditedUrl] = useState(null);
  const [token, setToken, deleteToken] = useCookies(["us-token"]);
  const [
    data,
    loggedInUser,
    loading,
    error,
  ] = useFetch();

  useEffect(() => {
    setUrls(data);
  }, [data]);

  useEffect(() => {
    if (!token["us-token"]) {
      // console.log('from app', token["us-token"]);
      window.location.href = "/";
    }
  }, [token]);

  const loadUrl = (url) => {
    setSelectedUrl(url);
    setEditedUrl(null);
  };

  const updatedUrl = (url) => {
    const newUrls = urls.map((td) => {
      if (td._id === url._id) {
        return url;
      }
      return td;
    });
    setUrls(newUrls);
  };

  const editClicked = (url) => {
    setEditedUrl(url);
    setSelectedUrl(null);
  };

  const newUrl = () => {
    setEditedUrl({ longUrl: "" });
    setSelectedUrl(null);
  };

  const urlCreated = (url) => {
    const newUrls = [...urls, url];
    setUrls(newUrls);
  };

  const removeClicked = (url) => {
    const newUrls = urls.filter((td) => td._id !== url._id);
    setUrls(newUrls);
  };

  const logoutUser = () => {
    deleteToken(["us-token"]);
  };

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error loading urls</h1>;

  return (
    <React.Fragment>
      <div className="App">
        <header className="App-header">
          <h1>
            <span>MERN URL Shortener</span>
          </h1>
          <FontAwesomeIcon icon={faSignOutAlt} onClick={logoutUser} />
        </header>
        <div className="layout">
          <h1>Hi {loggedInUser.email}!</h1>
          <br></br>
          <div>
            {urls ? (
              <UrlList
                loggedInUser={loggedInUser}
                urls={urls}
                urlClicked={loadUrl}
                editClicked={editClicked}
                removeClicked={removeClicked}
              />
            ) : null}
            <button className="pointer-cursor" onClick={newUrl}>
              New Url
            </button>
          </div>
          <UrlDetails url={selectedUrl} updateUrl={loadUrl} />
          <UrlForm
            url={editedUrl}
            updatedUrl={updatedUrl}
            urlCreated={urlCreated}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
