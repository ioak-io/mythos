import { httpDelete, httpGet, httpPost, httpPut } from "@/lib/RestTemplate";
import { Project } from "@/types/Project";

export const exportData = (authorization: any, suiteId: string) => {
    console.log(authorization, suiteId)
    return httpGet(`/export-suite/${suiteId}?type=CSV`, {
      headers: {
        Authorization: authorization?.access_token,
      },
    })
      .then((response) => {
        console.log(response)
        if (response.status === 200) {
          return Promise.resolve(response.data);
        }
        return Promise.resolve({});
      })
      .catch((error) => {
        return Promise.resolve({});
      });
  };