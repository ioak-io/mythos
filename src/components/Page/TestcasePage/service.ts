import { httpGet, httpPost, httpDelete, httpPut, httpPostGenerate } from "../../Lib/RestTemplate";

export const fetchTestcases = async(space:any, appId:any, reqId:any, useId:any): Promise<TestCase[]> =>{
    try {
            const response = await httpGet(`/${space}/application/${appId}/requirement/${reqId}/usecase/${useId}/testcase`, {});
            return response?.data; 
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
};

export const postTestcases = async(space:any, appId:any, reqId:any, useId:any,testcaseCreatePayload: any)=>{
  await httpPost(`/${space}/application/${appId}/requirement/${reqId}/usecase/${useId}/testcase`, testcaseCreatePayload, {} );
};

export const generateTestcases = async(space:any, appId:any, reqId:any, useId:any)=>{
  await httpPostGenerate(`/${space}/application/${appId}/requirement/${reqId}/usecase/${useId}/testcase/generate`,  {} );
};

export const deleteSingleTestcase = async(space:any, appId:any, reqId:any, useId:any,id:string)=>{
  await httpDelete(`/${space}/application/${appId}/requirement/${reqId}/usecase/${useId}/testcase/${id}`, {})
};

export const updateTestcase = async(space:any, appId:any, reqId:any, useId:any,id:string, data: any)=>{
  const response = await httpPut(`/${space}/application/${appId}/requirement/${reqId}/usecase/${useId}/testcase/${id}`,data, {})
  return response.data;
};

export const deleteTestcases = async(space:any, appId:any, reqId:any, useId:any) => {
  await httpDelete(`/${space}/application/${appId}/requirement/${reqId}/usecase/${useId}/testcase`, {});
};

export const deleteTestcasesByUsecase = async (space:any, appId:any, reqId:any,usecaseId: string) => {
  await httpDelete(`/${space}/application/${appId}/requirement/${reqId}/usecase/${usecaseId}/testcase`, {});
};