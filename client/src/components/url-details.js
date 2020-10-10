import React from "react";

function UrlDetails(props) {

  let urls = props.urls;

  return (
    <React.Fragment>
      {urls &&
        urls.length &&
        urls.map((url) => {
          return (
            <ol key={url && url._id} className="job-item">
              <li className="job-url">
                LongUrl : {url && url.longUrl}
                <br />
                ShortenedUrl : <a href={url && url.shortUrl} >Visit {url && url.shortUrl}</a>
                <br />
              </li>
              <br />
            </ol>
          );
      })}
    </React.Fragment>
  );
}

export default UrlDetails;
