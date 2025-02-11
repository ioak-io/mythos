import { httpGet, httpPut, httpPost } from "../../Lib/RestTemplate";


export const fetchSingleTestcase = async (space:any, appId:any, reqId:any, useId:any,id: string): Promise<TestCase[]> => {
    try {
        const response = await httpGet(`/${space}/application/${appId}/requirement/${reqId}/usecase/${useId}/testcase/${id}`, {});
        const testcase = Array.isArray(response?.data) ? response?.data[0] : response?.data;
        return testcase;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export const postTestcases = async (space:any, appId:any, reqId:any, useId:any,testcaseCreatePayload: any) => {
    await httpPost(`/${space}/application/${appId}/requirement/${reqId}/usecase/${useId}/testcase`, testcaseCreatePayload, {});
};

export const updateTestcase = async (space:any, appId:any, reqId:any, useId:any,id: string, data: any) => {
    const response = await httpPut(`/${space}/application/${appId}/requirement/${reqId}/usecase/${useId}/testcase/${id}`, data, {})
    return response.data;
};
