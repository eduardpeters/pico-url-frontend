import { useState } from "react";
import useCreateUrlMutation from "../hooks/useCreateUrlMutation";
import ResultModal from "./ResultModal";
import { ResultDetailsInterface } from "../types/picotypes";
import "../styles/CreateForm.css";

function CreateForm() {
    const [originalUrl, setOriginalUrl] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [resultDetails, setResultDetails] = useState<ResultDetailsInterface | null>(null);
    const createMutation = useCreateUrlMutation();

    async function handleCreateSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (originalUrl) {
            try {
                const response = await createMutation.mutateAsync(originalUrl);
                const newDetails = handleResponse(
                    response.status,
                    response.data.shortUrl,
                    originalUrl
                );
                setOriginalUrl("");
                setResultDetails(newDetails);
            } catch (error: unknown) {
                setResultDetails({
                    isError: true,
                    message: error instanceof Error ? error.message : "Failed to create URL",
                });
            }
            setShowResult(true);
        }
    }

    function handleResponse(status: number, shortUrl: string, longUrl: string) {
        const newDetails: ResultDetailsInterface = {
            isError: false,
            message: "",
            originalUrl: longUrl,
            picoUrl: shortUrl,
        };
        switch (status) {
            case 200:
                newDetails.message = "Pico URL already exists:";
                break;
            case 201:
                newDetails.message = "New Pico URL created:";
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
            <form className="create__container" onSubmit={(event) => handleCreateSubmit(event)}>
                <label className="create__label" htmlFor="originalUrl">
                    Create a Pico URL
                </label>
                <input
                    className="create__input"
                    type="url"
                    id="originalUrl"
                    value={originalUrl}
                    onChange={(event) => setOriginalUrl(event.target.value)}
                    placeholder="Long URL goes here!"
                    required
                ></input>
                <button className="create__button" type="submit">
                    Minify!
                </button>
            </form>
            {showResult && <ResultModal details={resultDetails} closeModal={closeModal} />}
        </>
    );
}

export default CreateForm;
