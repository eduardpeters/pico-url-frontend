import { useState } from "react";

interface UrlEditFormProps {
    originalUrl: string;
    userToken: string;
    closeForm: () => void;
}

function UrlEditForm({ originalUrl, userToken, closeForm }: UrlEditFormProps) {
    const [newUrl, setNewUrl] = useState(originalUrl);

    async function handleUrlEdit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (newUrl === originalUrl) {
            return ;
        }
        console.log("Ready to send");
        if (userToken) {
            console.log("Send Request");
        }
    }

    return (
        <form onSubmit={event => handleUrlEdit(event)}>
            <label htmlFor="url-input">New URL:</label>
            <input id="url-input" type="url" value={newUrl} onChange={event => setNewUrl(event.target.value)}></input>
            <button type="submit">Replace!</button>
            <button type="button" onClick={() => closeForm()}>Nevermind</button>
        </form>
    );
}

export default UrlEditForm;