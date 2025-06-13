import { httpGet, httpPut, httpPost } from "../../Lib/RestTemplate";

const domain = "testcase";
export const fetchSingleTestcase = async (space:any, appId:any, reqId:any, useId:any,id: string): Promise<TestCase[]> => {
    try {
        const response = await httpGet(`/${space}/${domain}/${id}`, {});
        const testcase = Array.isArray(response?.data) ? response?.data[0] : response?.data;
        return testcase;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export const postTestcases = async (space:any, appId:any, reqId:any, useId:any,testcaseCreatePayload: any) => {
    await httpPost(`/${space}/${domain}`, testcaseCreatePayload, {});
};

export const updateTestcase = async (space:any, appId:any, reqId:any, useId:any,id: string, data: any) => {
    const response = await httpPut(`/${space}/${domain}/${id}`, data, {})
    return response.data;
};
