import axios from 'axios';

import { getSessionValue } from '../../utils/SessionUtils';

export const axiosInstance = axios.create();
export const axiosManualInstance = axios.create();

const baseUrl = process.env.REACT_APP_API_URL;

export function httpGet(endpoint: string, headers: any, url?: string) {
  try {
    const token = getSessionValue('testgenie-access_token');
    console.log("TOKEN:...........", token)
    if (token) {
      headers["Authorization"] = token || "";
    }
    return axiosInstance.get((url || baseUrl) + endpoint, { headers });

  } catch (error) {
    console.error("Get Api Error: ");
    
  }

  // .then(function(response) {
  //     return Promise.resolve(response);
  // }
  // )
}

export function httpPost(
  endpoint: string,
  payload: any,
  headers: any,
  url?: string
) {
  const token = getSessionValue('testgenie-access_token');
  // if (token) {
  //   headers["Authorization"] = token;
  // }
  headers["Authorization"] = token;
  return axiosInstance.post((url || baseUrl) + endpoint, payload, { headers });
  //     .then(function(response) {
  //         return Promise.resolve(response);
  //     }
  // )
}

export function httpPostGenerate(
  endpoint: string,
  headers: any,
  payload?: any,
  url?: string
) {
  const token = getSessionValue('testgenie-access_token');
  if (token) {
    headers["Authorization"] = token || "";
  }
  return axiosInstance.post((url || baseUrl) + endpoint, payload, { headers });
}

export function httpPut(
  endpoint: string,
  payload: any,
  headers: any,
  url?: string
) {
  const token = getSessionValue('testgenie-access_token');
  if (token) {
    headers["Authorization"] = token;
  }
  return axiosInstance.put((url || baseUrl) + endpoint, payload, { headers });
  //     .then(function(response) {
  //         return Promise.resolve(response);
  //     }
  // )
}

export function httpDelete(
  endpoint: string,
  headers: any,
  url?: string
) {
  const token = getSessionValue('testgenie-access_token');
  if (token) {
    headers["Authorization"] = token;
  }
  return axiosInstance.delete((url || baseUrl) + endpoint, { headers });
  // return axiosInstance.delete((url || baseUrl) + endpoint, {
  //   headers,
  //   data: payload,
  // });
  //     .then(function(response) {
  //         return Promise.resolve(response);
  //     }
  // )
}

export function httpGetManual(endpoint: string, headers: any, url?: string) {
  const token = getSessionValue('testgenie-access_token');
  if (token) {
    headers["Authorization"] = token;
  }
  return axiosManualInstance.get((url || baseUrl) + endpoint, { headers });
  // .then(function(response) {
  //     return Promise.resolve(response);
  // }
  // )
}

export function httpPostManual(
  endpoint: string,
  payload: any,
  headers: any,
  url?: string
) {
  const token = getSessionValue('testgenie-access_token');
  if (token) {
    headers["Authorization"] = token;
  }
  return axiosManualInstance.post(
    (url || baseUrl) + endpoint,
    payload,
    { headers }
  );
  //     .then(function(response) {
  //         return Promise.resolve(response);
  //     }
  // )
}

export function httpPutManual(
  endpoint: string,
  payload: any,
  headers: any,
  url?: string
) {
  const token = getSessionValue('testgenie-access_token');
  if (token) {
    headers["Authorization"] = token;
  }
  return axiosManualInstance.put((url || baseUrl) + endpoint, payload, { headers });
  //     .then(function(response) {
  //         return Promise.resolve(response);
  //     }
  // )
}

export function httpDeleteManual(
  endpoint: string,
  payload: any,
  headers: any,
  url?: string
) {
  return axiosManualInstance.delete((url || baseUrl) + endpoint);
  // return axiosInstance.delete((url || baseUrl) + endpoint, {
  //   headers,
  //   data: payload,
  // });
  //     .then(function(response) {
  //         return Promise.resolve(response);
  //     }
  // )
}
