import { httpDelete, httpGet, httpPost, httpPut } from "@/lib/RestTemplate";
import { Assessment } from "@/types/Assessment";

export const getAssessmentById = (authorization: any, id: string) => {
  console.log(authorization, id)
  return httpGet(`/assessment/${id}`, {
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

export const saveAssessmentById = (id: string, payload: Assessment, authorization?: any) => {
  return httpPut(`/assessment/${id}`, payload, {
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

export const deleteAssessmentById = (id: string, authorization?: any) => {
  return httpDelete(`/assessment/${id}`, {
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
