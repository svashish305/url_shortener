export class API {
  static loginUser(body) {
    return fetch(`/api/users/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((resp) => resp.json());
  }

  static registerUser(body) {
    return fetch(`/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((resp) => resp.json());
  }

  static currentLoggedInUser(token) {
    return fetch(`/api/users/loggedin`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((resp) => resp.json());
  }

  static getUrls(token) {
    return fetch(`/api/urls/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((resp) => resp.json());
  }

  static shortenUrl(body, token) {
    return fetch(`/api/users/shorten`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }).then((resp) => resp.json());
  }

  static redirectUrl(shortId, token) {
    return fetch(`/api/users/search/${shortId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((resp) => resp.json());
  }
}
