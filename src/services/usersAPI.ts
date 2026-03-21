import api from "./api";

async function postRegister(name: string, email: string, password: string) {
    const response = await api.post("users/", { name, email, password });
    return response.data;
}

export const usersAPI = { postRegister };
