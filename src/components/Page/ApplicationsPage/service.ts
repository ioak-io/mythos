import { httpDelete, httpGet, httpPost, httpPut } from "../../Lib/RestTemplate";
const domain = "application";
export const fetchData = async (space:any): Promise<Application[]> => {
  try {
      const response = await httpPost(`/${space}/${domain}/search`, {}, {});
      console.log("Response from fetchData:", response);
      return response?.data?.data;
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