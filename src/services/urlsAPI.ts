import api from "./api";

async function getOriginal(shortId: string) {
    const response = await api.get(`urls/${shortId}`);
    return response.data;
}

async function getCount() {
    const response = await api.get("urls/count");
    return response.data;
}

async function getUrls() {
    const response = await api.get("urls");
    return response.data;
}

async function postUrl(originalUrl: string) {
    const response = await api.post("urls", { url: originalUrl });
    return response;
}

async function patchUrl(shortUrl: string, originalUrl: string) {
    const response = await api.patch(`urls/${shortUrl}`, { url: originalUrl });
    return response;
}

async function deleteUrl(shortId: string) {
    const response = await api.delete(`urls/${shortId}`);
    return response;
}

export const urlsAPI = { getOriginal, getCount, getUrls, postUrl, patchUrl, deleteUrl };
