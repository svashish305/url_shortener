import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { API } from "../api-service";
import { useCookies } from "react-cookie";

function UrlList(props) {
  const [token] = useCookies(['us-token']);

  const urlClicked = (url) => (evt) => {
    props.urlClicked(url);
  };

  const editClicked = (url) => {
    props.editClicked(url);
  };

  const removeClicked = (url) => {
    API.deleteUrl(url._id, token['us-token'])
      .then(() => props.removeClicked(url))
      .catch((error) => console.log(error));
  };

  const redirect = (shortUrl) => {
    API.redirectUrl(shortUrl, token['us-token'])
      .then(res => window.location.href = res)
      .catch((error) => console.log(error));

  }

  return (
    <React.Fragment>
      <div>
        {props.urls &&
          props.urls.length &&
          props.urls.map((url) => {
            return (
              <div key={url && url._id} className="url-item">
                <h2 className="pointer-cursor" onClick={urlClicked(url)}>
            ShortUrl: <a onClick={() => redirect(url.urlCode)}>{url.shortUrl}</a>
                </h2>
                <div>
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="pointer-cursor"
                    onClick={() => editClicked(url)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="pointer-cursor"
                    onClick={() => removeClicked(url)}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </React.Fragment>
  );
}

export default UrlList;
