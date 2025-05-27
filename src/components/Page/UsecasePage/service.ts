import { httpGet, httpPost, httpPostGenerate, httpDelete, httpPut } from "../../Lib/RestTemplate";
const domain = "usecase";
export const fetchUsecases = async(space:any, appId:any, reqId:any): Promise<Usecases[]> =>{
    try {
            const response = await httpPost(`/${space}/${domain}/search`, {}, {});
            return response?.data?.data; 
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
};

export const postUsecases = async(space:any, appId:any, reqId:any,usecaseCreatePayload: any)=>{
  await httpPost(`/${space}/${domain}`, usecaseCreatePayload, {} );
};

export const generateUsecases = async(space:any, appId:any, reqId:any)=>{
  await httpPostGenerate(`/${space}/${domain}/${reqId}/generate`, {} );
};

export const deleteSingle = async(space:any, appId:any, reqId:any,reference:string)=>{
  await httpDelete(`/${space}/${domain}/${reference}`, {})
};

export const deleteUsecases = async(space:any)=>{
  await httpDelete(`/${space}/${domain}`, {})
};

export const updateUsecase = async(space:any, appId:any, reqId:any,reference:string, data:any)=>{
  const response = await httpPut(`/${space}/${domain}/${reference}`,data,  {})
  return response.data;
};