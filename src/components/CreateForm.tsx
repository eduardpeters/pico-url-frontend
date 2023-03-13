import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { urlsAPI } from "../services/urlsAPI";
import ResultModal from "./ResultModal";
import { ResultDetailsInterface } from "../types/picotypes";
import "../styles/CreateForm.css";

interface CreateFormProps {
    urlCount: number;
    setUrlCount: React.Dispatch<React.SetStateAction<number>>;
}

interface CreateResponseInterface {
    status: number;
    data: {
        shortUrl: string;
    }
}

function CreateForm({ urlCount, setUrlCount }: CreateFormProps) {
    const authContext = useAuthContext();
    const [originalUrl, setOriginalUrl] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [resultDetails, setResultDetails] = useState<ResultDetailsInterface | null>(null);

    async function handleCreateSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (originalUrl && authContext?.userDetails?.token) {
            const response = await urlsAPI.postUrl(authContext?.userDetails?.token, originalUrl);
            if (!(response as { error: string }).error) {
                const newDetails = handleResponse(
                    (response as CreateResponseInterface).status,
                    (response as CreateResponseInterface).data.shortUrl,
                    originalUrl,
                    urlCount,
                    setUrlCount
                );
                setOriginalUrl("");
                setResultDetails(newDetails);
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

    function handleResponse(status: number, shortUrl: string, longUrl: string, urlCount: number, setUrlCount: React.Dispatch<React.SetStateAction<number>>) {
        const newDetails: ResultDetailsInterface = {
            isError: false,
            message: "",
            originalUrl: longUrl,
            picoUrl: shortUrl
        }
        switch (status) {
            case (200):
                newDetails.message = "Pico URL already exists:";
                break;
            case (201):
                newDetails.message = "New Pico URL created:";
                setUrlCount(urlCount + 1);
                break;
            default:
                newDetails.isError = true;
                newDetails.message = "Unexpected error";
        }
        return newDetails;
    }

    function closeModal() {
        setResultDetails(null);
        setShowResult(false);
    }

    return (
        <>
            <form className="create__container" onSubmit={event => handleCreateSubmit(event)}>
                <label className="create__label" htmlFor="originalUrl">Create a Pico URL</label>
                <input
                    className="create__input"
                    type="url"
                    id="originalUrl"
                    value={originalUrl}
                    onChange={event => setOriginalUrl(event.target.value)}
                    placeholder="Long URL goes here!"
                    required
                ></input>
                <button className="create__button" type="submit">Minify!</button>
            </form>
            {showResult && <ResultModal details={resultDetails} closeModal={closeModal} />}
        </>
    );
}

export default CreateForm;