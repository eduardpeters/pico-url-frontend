import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { urlsAPI } from "../services/urlsAPI";

interface CreateResponseInterface {
    status: number;
    data: {
        shortUrl: string;
    }
}

function CreateForm() {
    const authContext = useAuthContext();
    const [originalUrl, setOriginalUrl] = useState("");

    async function handleCreateSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (originalUrl && authContext?.userDetails?.token) {
            const response = await urlsAPI.postUrl(authContext?.userDetails?.token, originalUrl);
            if (!(response as {error: string}).error) {
                showCreateResult((response as CreateResponseInterface).status, (response as CreateResponseInterface).data.shortUrl);
                setOriginalUrl("");
            }
        }
    }

    function showCreateResult(status: number, shortUrl: string) {
        switch (status) {
            case (200):
                console.log("Pico URL already exists, this is it: ", shortUrl);
                break;
            case (201):
                console.log("New PICO URL created: ", shortUrl);
                break;
            default:
                console.error("Unexpected status");
        }
    }

    return (
        <form onSubmit={event => handleCreateSubmit(event)}>
            <label htmlFor="originalUrl">URL to shorten</label>
            <input
                type="url"
                id="originalUrl"
                value={originalUrl}
                onChange={event => setOriginalUrl(event.target.value)}
                required
            ></input>
            <button type="submit">Minify!</button>
        </form>
    );
}

export default CreateForm;