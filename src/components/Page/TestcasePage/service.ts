import { httpGet, httpPost, httpDelete, httpPut, httpPostGenerate } from "../../Lib/RestTemplate";
import { appId } from "../ApplicationsPage";
import { reqId } from "../RequirementsPage";
import { useId } from "../UsecasePage";
import { space } from "../LandingPage";

export const fetchTestcases = async(): Promise<TestCase[]> =>{
    try {
            const response = await httpGet(`/${space}/application/${appId}/requirement/${reqId}/usecase/${useId}/testcase`, {});
            return response.data; 
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
};

export const postTestcases = async(testcaseCreatePayload: any)=>{
  await httpPost(`/${space}/application/${appId}/requirement/${reqId}/usecase/${useId}/testcase`, testcaseCreatePayload, {} );
}

export const generateTestcases = async()=>{
  await httpPostGenerate(`/${space}/application/${appId}/requirement/${reqId}/usecase/${useId}/testcase/generate`,  {} );
}