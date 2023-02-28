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
        return {error: (error as AxiosError).response?.data};
    }
}

export const urlsAPI = { getOriginal };