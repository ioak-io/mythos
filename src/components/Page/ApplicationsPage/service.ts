import { httpDelete, httpGet, httpPost, httpPut } from "../../Lib/RestTemplate";

export const fetchData = async (space:any): Promise<Application[]> => {
  try {
      const response = await httpGet(`/${space}/application`, {});
      return response?.data;
  } catch (error) {
      console.error("Error fetching data:", error);
      throw error; 
  }
};

export const postData = async(space:any,appNamePayload: any)=>{
  await httpPost(`/${space}/application`, appNamePayload, {} );
}

export const deleteSingle = async(space:any,id:any) =>{
  await httpDelete(`/${space}/application/${id}`, {})
};

export const updateApp = async(space:any,id:string, updatePayload: any) => {
  const response = await httpPut(`/${space}/application/${id}`, updatePayload, {})
  return response.data;
};