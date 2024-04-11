import { httpGet, httpPost } from "@/lib/RestTemplate";
import { Project } from "@/types/Project";
import { Authorization } from "@/types/Authorization";

export const getProjects = (authorization?: Authorization) => {
  return httpGet(`/suite`, {
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

export const saveProject = (payload: Project, authorization?: any) => {
  return httpPost(`/suite`, payload, {
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
