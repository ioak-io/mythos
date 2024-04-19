import { httpDelete, httpGet, httpPost, httpPut } from "@/lib/RestTemplate";
import { Project } from "@/types/Project";
import { Authorization } from "@/types/Authorization";

export const getAllUseCases = (suiteid:string, authorization?: Authorization) => {
  return httpGet(`/suite/${suiteid}/usecase`, {
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

export const saveUseCase = (suiteid:string, payload: Project, authorization?: any) => {
  return httpPost(`/suite/${suiteid}/usecase `, payload, {
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

export const editUseCase = (suiteid:string, usecaseid:string, payload: Project, authorization?: any) => {
  return httpPut(`/suite/${suiteid}/usecase/${usecaseid} `, payload, {
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

export const getUseCaseById = (suiteid:string, usecaseid:string, authorization: any) => {
    return httpGet(`/suite/${suiteid}/usecase/${usecaseid}`, {
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

export const deleteUseCase = (suiteid:string, usecaseid:string, authorization?: any) => {
   return httpDelete(`/suite/${suiteid}/usecase/${usecaseid}`, {
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
