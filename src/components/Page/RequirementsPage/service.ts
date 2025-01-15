import { space } from "../LandingPage";
import { appId } from "../ApplicationsPage";
import { httpGet, httpPost } from "../../../../src/components/Lib/RestTemplate";

export const fetchRequirements = async (): Promise<Requirement[]> => {
    try {
        const response = await httpGet(`/${space}/application/${appId}/requirement`, {});
        return response.data; 
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export const postRequirements = async(reqCreatePayload: any)=>{
  await httpPost(`/${space}/application/${appId}/requirement`, reqCreatePayload, {} );
}
