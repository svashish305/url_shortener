import React, { useState, useEffect } from "react";
import { API } from "../api-service";
import { useCookies } from "react-cookie";

function UrlForm(props) {
  const [longUrl, setLongUrl] = useState("");
  const [token] = useCookies(["us-token"]);

  useEffect(() => {
    setLongUrl(props.url.longUrl);
  }, [props.url]);

  const updateClicked = () => {
    API.updateUrl(props.url._id, { longUrl }, token["us-token"])
      .then((resp) => props.updatedUrl(resp))
      .catch((error) => console.log(error));
  };

  const createClicked = () => {
    API.createUrl({ longUrl }, token["us-token"])
      .then((resp) => props.jobCreated(resp))
      .catch((error) => console.log(error));
  };

  const isDisabled =
    (longUrl && longUrl.length === 0);

  return (
    <React.Fragment>
      {props.url ? (
        <div>
          <label htmlFor="longUrl">Original Long URL</label>
          <br />
          <input
            id="longUrl"
            type="text"
            placeholder="Long Url"
            value={longUrl}
            onChange={(evt) => setLongUrl(evt.target.value)}
          />
          <br />
          {props.url._id ? (
            <button
              className="pointer-cursor"
              onClick={updateClicked}
              disabled={isDisabled}
            >
              Update
            </button>
          ) : (
            <button
              className="pointer-cursor"
              onClick={createClicked}
              disabled={isDisabled}
            >
              Create
            </button>
          )}
        </div>
      ) : null}
    </React.Fragment>
  );
}

export default UrlForm;
