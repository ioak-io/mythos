
import { httpDelete, httpGet, httpPost, httpPut } from "../../../../src/components/Lib/RestTemplate";
const domain = "requirement";
export const fetchRequirements = async (space: any, reference:any): Promise<Requirement[]> => {
    try {
        const payload = {
          filters: {
            application: reference
          }
        }
        const response = await httpPost(`/${space}/${domain}/search`, payload , {});
        return response?.data?.data; 
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export const postRequirements = async(space: any, reqCreatePayload: any)=>{
  await httpPost(`/${space}/${domain}`, reqCreatePayload, {} );
};

export const deleteSingle = async(space: any, reference:any) =>{
  await httpDelete(`/${space}/${domain}/${reference}`, {})
};

export const updateRequirement = async(space: any, reference:any, data:any) =>{
  const response = await httpPut(`/${space}/${domain}/${reference}`, data ,{})
  return response.data;
};

