import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { UrlInterface } from "../types/picotypes";
import { urlsAPI } from "../services/urlsAPI";
import UrlEntry from "./UrlEntry";
import "../styles/UrlEntry.css";

interface UrlListProps {
    urlCount: number;
    setUrlCount: React.Dispatch<React.SetStateAction<number>>;
}

function UrlList({ urlCount, setUrlCount }: UrlListProps) {
    const authContext = useAuthContext();
    const [userUrls, setUserUrls] = useState<UrlInterface[]>([]);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function getUserUrls() {
            try {
                const response = await urlsAPI.getUrls();
                setUserUrls(response);
            } catch (error: unknown) {
                setErrorMessage(error instanceof Error ? error.message : "Failed to load URLs");
                setShowError(true);
            }
        }
        if (authContext?.isLoggedIn && authContext.userDetails?.token) {
            getUserUrls();
        }
    }, [urlCount, authContext?.isLoggedIn, authContext?.userDetails?.token]);

    return (
        <div className="list__container">
            {showError ? (
                <div>{errorMessage}</div>
            ) : (
                userUrls.map((entry) => (
                    <UrlEntry
                        key={entry._id}
                        entry={entry}
                        urlCount={urlCount}
                        setUrlCount={setUrlCount}
                    />
                ))
            )}
        </div>
    );
}

export default UrlList;
