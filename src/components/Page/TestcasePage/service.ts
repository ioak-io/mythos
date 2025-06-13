import { httpGet, httpPost, httpDelete, httpPut, httpPostGenerate } from "../../Lib/RestTemplate";
const domain = "testcase";
export const fetchTestcases = async(space:any, useId:any): Promise<TestCase[]> =>{
    try {
      console.log("USE ID:", useId)
      const payload = {
        filters: {
          usecase: useId
        }
      }
      const response = await httpPost(`/${space}/${domain}/search`, payload, {});
      return response?.data?.data; 
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export const postTestcases = async(space:any, appId:any, reqId:any, useId:any,testcaseCreatePayload: any)=>{
  await httpPost(`/${space}/${domain}`, testcaseCreatePayload, {} );
};

export const generateTestcases = async(space:any, useId:any)=>{
  const response = await httpPostGenerate(`/${space}/${useId}/generate/testcase`,  {} );
};

export const deleteSingleTestcase = async(space:any, appId:any, reqId:any, useId:any,id:string)=>{
  await httpDelete(`/${space}/${domain}/${id}`, {})
};

export const updateTestcase = async(space:any, appId:any, reqId:any, useId:any,id:string, data: any)=>{
  const response = await httpPut(`/${space}/application/${appId}/requirement/${reqId}/usecase/${useId}/testcase/${id}`,data, {})
  return response.data;
};

export const deleteTestcases = async(space:any, appId:any, reqId:any, useId:any) => {
  await httpDelete(`/${space}/${domain}`, {});
};

export const deleteTestcasesByUsecase = async (space:any, usecaseId: string) => {
  await httpDelete(`/${space}/${domain}/${usecaseId}/testcase`, {});
};