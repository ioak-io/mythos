import { httpGet, httpPut, httpPost } from "../../Lib/RestTemplate";
import { appId } from "../ApplicationsPage";
import { space } from "../LandingPage";
import { reqId } from "../RequirementsPage";
import { useId } from "../UsecasePage";
import { testId } from "../TestcasePage";

export const fetchSingleTestcase = async (id: string): Promise<TestCase[]> => {
    try {
        const response = await httpGet(`/${space}/application/${appId}/requirement/${reqId}/usecase/${useId}/testcase/${testId}`, {});
        const testcase = Array.isArray(response?.data) ? response?.data[0] : response?.data;
        return testcase;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export const postTestcases = async (testcaseCreatePayload: any) => {
    await httpPost(`/${space}/application/${appId}/requirement/${reqId}/usecase/${useId}/testcase`, testcaseCreatePayload, {});
};

export const updateTestcase = async (id: string, data: any) => {
    const response = await httpPut(`/${space}/application/${appId}/requirement/${reqId}/usecase/${useId}/testcase/${id}`, data, {})
    return response.data;
};
