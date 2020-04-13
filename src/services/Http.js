import Axios from "axios";
import queryString from "query-string";
import Auth from "./Auth";

const Http = () => {
  const API_HOST =
    process.env.NODE_ENV === "production"
      ? "https://1fcee761-fa67-402e-aca9-d57991a9f60c.mock.pstmn.io"
      : "http://localhost:8000/api";

  const buildUrl = (url, param = null) => {
    url = API_HOST + (url.startsWith("/") ? url : `/${url}`);
    if (!param) {
      return url;
    }
    if (typeof param === "string") {
      return url + param;
    }
    if (typeof param === "object") {
      return `${url}?${queryString.stringify(param)}`;
    }
    return url;
  };

  const buildAuthHeader = () => {
    const token = Auth.getAuthToken();
    return token
      ? {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      : {};
  };

  return {
    API_HOST,
    buildUrl,
    buildAuthHeader,
    get: (url, param = null, auth = true, isRelative = true) => {
      if (isRelative) {
        url = buildUrl(url, param);
      }
      return auth ? Axios.get(url, buildAuthHeader()) : Axios.get(url);
    },
    post: (url, param = null, auth = true, isRelative = true) => {
      if (isRelative) {
        url = buildUrl(url);
      }
      return auth
        ? Axios.post(url, param, buildAuthHeader())
        : Axios.post(url, param);
    },
    put: (url, param = null, auth = true, isRelative = true) => {
      if (isRelative) {
        url = buildUrl(url);
      }
      return auth
        ? Axios.put(url, param, buildAuthHeader())
        : Axios.put(url, param);
    },
    delete: (url, param = null, auth = true, isRelative = true) => {
      if (isRelative) {
        url = buildUrl(url, param);
      }
      return auth ? Axios.delete(url, buildAuthHeader()) : Axios.delete(url);
    }
  };
};

export default Http();
