import { httpDelete, httpGet, httpPost, httpPut } from "@/lib/RestTemplate";
import { Project } from "@/types/Project";
import { Authorization } from "@/types/Authorization";


export const getConsolidatedTestcases = (suiteId:string, authorization?: any) => {
  return httpGet(`/suite/${suiteId}/usecase/testcase`, {
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