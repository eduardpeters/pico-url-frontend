import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { urlsAPI } from "../services/urlsAPI";
import styles from "../styles/general.module.css";
import "../styles/Redirect.css";

function Redirect() {
    const { shortId } = useParams();
    const navigate = useNavigate();
    const [originalUrl, setOriginalUrl] = useState("");
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const showErrorMessage = !shortId || shortId.length !== 10;

    useEffect(() => {
        async function getOriginal(sid: string) {
            const response = await urlsAPI.getOriginal(sid);
            if (!response.error) {
                setOriginalUrl(response.originalUrl);
                if (!timer.current) {
                    timer.current = setTimeout(
                        () => window.open(response.originalUrl, "_self"),
                        5000
                    );
                }
            } else {
                navigate("/not-found", { state: { error: response.error } });
            }
        }
        if (shortId && shortId.length === 10) {
            getOriginal(shortId);
        }
        return () => clearTimeout(timer.current as ReturnType<typeof setTimeout>);
    }, [shortId, navigate]);

    return (
        <div className={styles.container}>
            <h3 className={styles.subtitle}>Thank you for using Pico URL</h3>
            <div className="redirect__content">
                {!showErrorMessage ? (
                    <>
                        <h3>The service will now redirect you to:</h3>
                        <p>{originalUrl}</p>
                        <a href={originalUrl} target="_self" className="redirect__link">
                            Speed things up!
                        </a>
                    </>
                ) : (
                    <>
                        <h3>Incorrect shortened URL format</h3>
                        <Link to="/" className="redirect__link">
                            Return to Homepage
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default Redirect;
