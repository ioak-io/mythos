/* eslint-disable import/prefer-default-export */
import { httpGet, httpPost, httpPut } from '../Lib/RestTemplate';

export function fetchSpace() {
  const apiUrl = process.env.REACT_APP_ONEAUTH_API_URL;
  if (!apiUrl) {
    throw new Error("Environment variable REACT_APP_ONEAUTH_API_URL is not set");
  }

  return httpGet(`/realm/introspect`, {}, apiUrl).then((response) => {
    if (response && response.data) {
      return Promise.resolve(response.data);
    }
    return Promise.reject(new Error("Response data is undefined"));
  });
}
