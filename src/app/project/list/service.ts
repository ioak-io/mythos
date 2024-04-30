import { httpDelete, httpGet, httpPost, httpPut } from "@/lib/RestTemplate";
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

export const editProject = (payload: Project, projectId:string, authorization: any) => {
  console.log(authorization)
  return httpPut(`/suite/${projectId}`, payload, {
    headers: {
      Authorization: authorization?.access_token
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

export const deleteProject = (projectId:string,authorization?: any) => {
  console.log(authorization)
   return httpDelete(`/suite/${projectId}`, {
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
      console.error('Error deleting project:', error);
      return Promise.resolve({});
    });
};
