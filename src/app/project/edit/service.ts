import { httpDelete, httpGet, httpPost, httpPut } from "@/lib/RestTemplate";
import { Project } from "@/types/Project";

export const getProjectById = (authorization: any, id: string) => {
  console.log(authorization, id)
  return httpGet(`/project/${id}`, {
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

export const saveProjectById = (id: string, payload: Project, authorization?: any) => {
  return httpPut(`/project/${id}`, payload, {
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

export const deleteProjectById = (id: string, authorization?: any) => {
  return httpDelete(`/project/${id}`, {
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
