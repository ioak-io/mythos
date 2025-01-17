import { httpGet, httpPost, httpPostGenerate, httpDelete, httpPut } from "../../Lib/RestTemplate";
import { space } from "../LandingPage";
import { appId } from "../ApplicationsPage";
import { reqId } from "../RequirementsPage";

export const fetchUsecases = async(): Promise<Usecases[]> =>{
    try {
            const response = await httpGet(`/${space}/application/${appId}/requirement/${reqId}/usecase`, {});
            return response?.data; 
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
};

export const postUsecases = async(usecaseCreatePayload: any)=>{
  await httpPost(`/${space}/application/${appId}/requirement/${reqId}/usecase`, usecaseCreatePayload, {} );
}

export const generateUsecases = async()=>{
  await httpPostGenerate(`/${space}/application/${appId}/requirement/${reqId}/usecase/generate`, {} );
}