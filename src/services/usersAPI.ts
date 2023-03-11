import axios, { AxiosError } from "axios";

const baseUrl = process.env.REACT_APP_API_URL;

async function postRegister(name: string, email: string, password: string) {
    const requestUrl = `${baseUrl}users/`;
    const requestBody = { name, email, password };
    try {
        const response = await axios.post(requestUrl, requestBody);
        return response.data;
    }
    catch (error: unknown) {
        console.error(error);
        return {error: (error as AxiosError).response?.data || (error as AxiosError).message };
    }
}

export const usersAPI = { postRegister };