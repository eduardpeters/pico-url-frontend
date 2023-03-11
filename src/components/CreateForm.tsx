import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { urlsAPI } from "../services/urlsAPI";
import ResultModal from "./ResultModal";
import { ResultDetailsInterface } from "../types/picotypes";

interface CreateResponseInterface {
    status: number;
    data: {
        shortUrl: string;
    }
}

function CreateForm() {
    const authContext = useAuthContext();
    const [originalUrl, setOriginalUrl] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [resultDetails, setResultDetails] = useState<ResultDetailsInterface | null>(null);

    async function handleCreateSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (originalUrl && authContext?.userDetails?.token) {
            const response = await urlsAPI.postUrl(authContext?.userDetails?.token, originalUrl);
            if (!(response as { error: string }).error) {
                showCreateResult((response as CreateResponseInterface).status, (response as CreateResponseInterface).data.shortUrl);
                setOriginalUrl("");
            } else {
                setResultDetails(
                    {
                        isError: true,
                        message: (response as { error: string }).error
                    }
                );
            }
            setShowResult(true);
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

    function closeModal() {
        setResultDetails(null);
        setShowResult(false);
    }

    return (
        <>
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
            {showResult && <ResultModal details={resultDetails} closeModal={closeModal} />}
        </>
    );
}

export default CreateForm;