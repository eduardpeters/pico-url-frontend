import axios, { AxiosError } from "axios";

const baseUrl = process.env.REACT_APP_API_URL;

async function postLogIn(email: string, password: string) {
    const requestUrl = `${baseUrl}auth/`;
    const requestBody = { email, password };
    try {
        const response = await axios.post(requestUrl, requestBody);
        console.log(response);
        return response.data;
    }
    catch (error: unknown) {
        console.error(error);
        return {error: (error as AxiosError).response?.data};
    }
}

export const authAPI = { postLogIn };