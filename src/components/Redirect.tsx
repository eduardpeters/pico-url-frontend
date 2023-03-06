import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { urlsAPI } from "../services/urlsAPI";
import styles from "../styles/general.module.css";
import "../styles/Redirect.css";

function Redirect() {
    const { shortId } = useParams();
    const navigate = useNavigate();
    const [originalUrl, setOriginalUrl] = useState("");
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        async function getOriginal(shortId: string) {
            const response = await urlsAPI.getOriginal(shortId);
            console.log(response);
            if (!response.error) {
                setOriginalUrl(response.originalUrl);
                timeout = setTimeout(() => window.open(response.originalUrl, "_self"), 5000);
            }
            else {
                navigate("/not-found", { state: { error: response.error } });
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
        <div className={styles.container}>
            <h3 className={styles.subtitle}>Thank you for using Pico URL</h3>
            <div className="redirect__content">
                {!showErrorMessage ?
                    <>
                        <h3>The service will now redirect you to:</h3>
                        <p>{originalUrl}</p>
                        <a href={originalUrl} target="_self" className="redirect__link">Speed things up!</a>
                    </>
                    :
                    <>
                        <h3>Incorrect shortened URL format</h3>
                        <Link to="/" className="redirect__link">Return to Homepage</Link>
                    </>
                }
            </div>
        </div>
    );
}

export default Redirect;