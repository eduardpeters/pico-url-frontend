import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { UrlEntry } from "../types/picotypes";
import { urlsAPI } from "../services/urlsAPI";

interface UrlListProps {
    urlCount: number;
    setUrlCount: React.Dispatch<React.SetStateAction<number>>;
}

function UrlList({ urlCount, setUrlCount }: UrlListProps) {
    const authContext = useAuthContext();
    const [userUrls, setUserUrls] = useState<UrlEntry[]>([]);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function getUserUrls(userToken: string) {
            const response = await urlsAPI.getUrls(userToken);
            if (!response.error) {
                setUserUrls(response);
            } else {
                setErrorMessage(response.error);
                setShowError(true);
            }
        }
        if (authContext?.isLoggedIn && authContext.userDetails?.token) {
            getUserUrls(authContext.userDetails?.token);
        }
    }, [urlCount]);

    return (
        <div>
            Display the users urls
            {
                showError ?
                    <div>{errorMessage}</div>
                    :
                    userUrls.map(entry => <p>{entry.shortUrl}</p>)
            }
        </div>
    );
}

export default UrlList;