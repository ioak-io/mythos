
import { httpDelete, httpGet, httpPost, httpPut } from "../../../../src/components/Lib/RestTemplate";

export const fetchRequirements = async (space: any, appId:any): Promise<Requirement[]> => {
    try {
        const response = await httpGet(`/${space}/application/${appId}/requirement`, {});
        return response?.data; 
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export const postRequirements = async(space: any, appId:any, reqCreatePayload: any)=>{
  await httpPost(`/${space}/application/${appId}/requirement`, reqCreatePayload, {} );
};

export const deleteSingle = async(space: any, appId:any, id:any) =>{
  await httpDelete(`/${space}/application/${appId}/requirement/${id}`, {})
};

export const updateRequirement = async(space: any, appId:any, id:any, data:any) =>{
  const response = await httpPut(`/${space}/application/${appId}/requirement/${id}`, data ,{})
  return response.data;
};

