import { appId } from "./index";
import { httpDelete, httpGet, httpPost, httpPut } from "../../Lib/RestTemplate";
import { space } from "../LandingPage";
export const fetchData = async (): Promise<Application[]> => {
  try {
      const response = await httpGet(`/${space}/application`, {});
      return response?.data;
  } catch (error) {
      console.error("Error fetching data:", error);
      throw error; 
  }
};

export const postData = async(appNamePayload: any)=>{
  await httpPost(`/${space}/application`, appNamePayload, {} );
}

export const deleteSingle = async(id:any) =>{
  await httpDelete(`/${space}/application/${id}`, {})
};

export const updateApp = async(id:string, updatePayload: any) => {
  const response = await httpPut(`/${space}/application/${id}`, updatePayload, {})
  return response.data;
};