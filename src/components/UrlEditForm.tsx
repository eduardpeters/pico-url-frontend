import { useState } from "react";
import { urlsAPI } from "../services/urlsAPI";
import "../styles/UrlEditForm.css";

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
        <form className="url__form" onSubmit={event => handleUrlEdit(event)}>
            <label className="url__label" htmlFor="url-input">New URL:</label>
            <input className="url__input" id="url-input" type="url" value={newUrl} placeholder="new looong url" onChange={event => setNewUrl(event.target.value)}></input>
            <button className="url__button url__button-replace" type="submit">Replace!</button>
            <button className="url__button url__button-cancel" type="button" onClick={() => closeForm()}>Nevermind</button>
        </form>
    );
}

export default UrlEditForm;