import { httpGet, httpPost, httpPostGenerate, httpDelete, httpPut } from "../../Lib/RestTemplate";
const domain = "usecase";
export const fetchUsecases = async(space:any, reqId:any): Promise<Usecases[]> =>{
    try {
      const payload = {
        filters: {
          requirement: reqId
        }
      }
      const response = await httpPost(`/${space}/${domain}/search`, payload , {});
      return response?.data?.data; 
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export const postUsecases = async(space:any, reqId:any,usecaseCreatePayload: any)=>{
  await httpPost(`/${space}/${domain}`, usecaseCreatePayload, {} );
};

export const generateUsecases = async(space:any, reqId:any)=>{
  const response = await httpPostGenerate(`/${space}/${domain}/${reqId}/generate`, {} );
  console.log(response);
};

export const deleteSingle = async(space:any, reqId:any,reference:string)=>{
  await httpDelete(`/${space}/${domain}/${reference}`, {})
};

export const deleteUsecases = async(space:any)=>{
  await httpDelete(`/${space}/${domain}`, {})
};

export const updateUsecase = async(space:any, reqId:any,reference:string, data:any)=>{
  const response = await httpPut(`/${space}/${domain}/${reference}`,data,  {})
  return response.data;
};