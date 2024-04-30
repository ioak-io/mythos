import { httpDelete, httpGet, httpPost, httpPut } from "@/lib/RestTemplate";
import { Project } from "@/types/Project";
import { Authorization } from "@/types/Authorization";

export const getTestcases = (suiteId:string,usecaseId:string,authorization?: Authorization) => {
  return httpGet(`/suite/${suiteId}/usecase/${usecaseId}/testcase`, {
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