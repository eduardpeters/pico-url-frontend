import axios, { AxiosError } from "axios";

const baseUrl = process.env.REACT_APP_API_URL;

async function getOriginal(shortId: string) {
    const requestUrl = `${baseUrl}urls/${shortId}`;
    try {
        const response = await axios.get(requestUrl);
        return response.data;
    }
    catch (error: unknown) {
        console.error(error);
        return {error: (error as AxiosError).response?.data || (error as AxiosError).message };
    }
}

async function getCount(userToken: string) {
    const requestUrl = `${baseUrl}urls/count`;
    const config = {
        headers: {
            Authorization: `Bearer ${userToken}`
        }
    }
    try {
        const response = await axios.get(requestUrl, config);
        return response.data;
    }
    catch (error) {
        console.error(error);
        return {error: (error as AxiosError).response?.data || (error as AxiosError).message };
    }
}

export const urlsAPI = { getOriginal, getCount };