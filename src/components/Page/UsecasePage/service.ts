import { httpGet, httpPost, httpPostGenerate, httpDelete, httpPut } from "../../Lib/RestTemplate";

export const fetchUsecases = async(space:any, appId:any, reqId:any): Promise<Usecases[]> =>{
    try {
            const response = await httpGet(`/${space}/application/${appId}/requirement/${reqId}/usecase`, {});
            return response?.data; 
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
};

export const postUsecases = async(space:any, appId:any, reqId:any,usecaseCreatePayload: any)=>{
  await httpPost(`/${space}/application/${appId}/requirement/${reqId}/usecase`, usecaseCreatePayload, {} );
};

export const generateUsecases = async(space:any, appId:any, reqId:any)=>{
  await httpPostGenerate(`/${space}/application/${appId}/requirement/${reqId}/usecase/generate`, {} );
};

export const deleteSingle = async(space:any, appId:any, reqId:any,id:string)=>{
  await httpDelete(`/${space}/application/${appId}/requirement/${reqId}/usecase/${id}`, {})
};

export const deleteUsecases = async(space:any, appId:any, reqId:any)=>{
  await httpDelete(`/${space}/application/${appId}/requirement/${reqId}/usecase`, {})
};

export const updateUsecase = async(space:any, appId:any, reqId:any,id:string, data:any)=>{
  const response = await httpPut(`/${space}/application/${appId}/requirement/${reqId}/usecase/${id}`,data,  {})
  return response.data;
};