import { httpGet, httpPost, httpPut } from "../../Lib/RestTemplate";
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