import { httpGet, httpPost } from "@/lib/RestTemplate";
import { Assessment } from "@/types/Assessment";
import { Authorization } from "@/types/Authorization";

export const getAssessments = (authorization?: Authorization) => {
  return httpGet(`/assessment`, {
    headers: {
      Authorization: authorization?.access_token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
      return Promise.resolve([]);
    })
    .catch((error) => {
      return Promise.resolve([]);
    });
};

export const saveAssessment = (payload: Assessment, authorization?: any) => {
  return httpPost(`/assessment`, payload, {
    headers: {
      Authorization: authorization?.access_token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
      return Promise.resolve({});
    })
    .catch((error) => {
      return Promise.resolve({});
    });
};
