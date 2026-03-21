import api from "./api";

async function postLogIn(email: string, password: string) {
    const response = await api.post("auth/", { email, password });
    return response.data;
}

export const authAPI = { postLogIn };
