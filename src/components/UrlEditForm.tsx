import { useState } from "react";
import { urlsAPI } from "../services/urlsAPI";

interface UrlEditFormProps {
    shortUrl: string;
    originalUrl: string;
    userToken: string;
    closeForm: () => void;
}

function UrlEditForm({ shortUrl, originalUrl, userToken, closeForm }: UrlEditFormProps) {
    const [newUrl, setNewUrl] = useState("");

    async function handleUrlEdit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (newUrl === originalUrl) {
            return ;
        }
        if (userToken) {
            const response = await urlsAPI.patchUrl(userToken, shortUrl, originalUrl);
        }
    }

    return (
        <form onSubmit={event => handleUrlEdit(event)}>
            <label htmlFor="url-input">New URL:</label>
            <input id="url-input" type="url" value={newUrl} placeholder="new looong url" onChange={event => setNewUrl(event.target.value)}></input>
            <button type="submit">Replace!</button>
            <button type="button" onClick={() => closeForm()}>Nevermind</button>
        </form>
    );
}

export default UrlEditForm;