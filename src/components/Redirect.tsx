import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { urlsAPI } from "../services/urlsAPI";

function Redirect() {
    const { shortId } = useParams();
    const navigate = useNavigate();
    const [originalUrl, setOriginalUrl] = useState("");
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        async function getOriginal(shortId: string) {
            const response = await urlsAPI.getOriginal(shortId);
            if (response) {
                setOriginalUrl(response.originalUrl);
                timeout = setTimeout(() => window.open(response.originalUrl, "_self"), 5000);
            }
            else {
                navigate("/not-found");
            }
        }
        if (shortId && shortId.length === 10) {
            getOriginal(shortId);
        }
        else {
            setShowErrorMessage(true);
        }
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="Redirect">
            <h3>Thank you for using Pico URL</h3>
            {!showErrorMessage ? 
                <div>
                    <h3>The service will now redirect you to:</h3>
                    <a href={originalUrl} target="_self">Speed things up!</a>
                </div>
                :
                <h3>Incorrect shortened URL</h3>
            }
        </div>
    );
}

export default Redirect;