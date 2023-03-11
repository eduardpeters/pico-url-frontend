import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";

function CreateForm() {
    const authContext = useAuthContext();
    const [originalUrl, setOriginalUrl] = useState("");

    async function handleCreateSubmit(event: React.FormEvent) {
        event.preventDefault();
        console.log("Submitted!!");
        if (originalUrl) {
            console.log("Sent to backend");
        }
    }

    return (
        <form onSubmit={event => handleCreateSubmit(event)}>
            <label>URL to shorten</label>
            <input type="url" onChange={event => setOriginalUrl(event.target.value)}></input>
            <button type="submit">Minify!</button>
        </form>
    );
}

export default CreateForm;