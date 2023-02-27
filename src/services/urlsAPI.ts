import axios from "axios";

const baseUrl = process.env.REACT_APP_API_URL;

async function getOriginal(shortId: string) {
    const requestUrl = `${baseUrl}urls/${shortId}`;
    console.log("Send to backend: ", requestUrl);
    try {
        const response = await axios.get(requestUrl);
        console.log(response);
        return response.data;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

export const urlsAPI = {getOriginal};