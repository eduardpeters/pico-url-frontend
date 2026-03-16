import { useState } from "react";
import { Copy, ChevronUp, ChevronDown, ExternalLink, Pencil, Trash2 } from "lucide-react";
import UrlEditForm from "./UrlEditForm";
import { UrlInterface } from "../types/picotypes";
import { urlsAPI } from "../services/urlsAPI";
import "../styles/UrlEntry.css";

interface UrlEntryProps {
    entry: UrlInterface;
    urlCount: number;
    setUrlCount: React.Dispatch<React.SetStateAction<number>>;
}

function UrlEntry({ entry, urlCount, setUrlCount }: UrlEntryProps) {
    const [showDetails, setShowDetails] = useState(false);
    const [toggleEdit, setToggleEdit] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const entryDate = new Date(entry.date);

    async function handleUrlDelete() {
        try {
            await urlsAPI.deleteUrl(entry.shortUrl.slice(-10));
            setUrlCount(urlCount - 1);
        } catch (error: unknown) {
            console.error(error);
        }
    }

    return (
        <div className="entry__container">
            <div className="entry__summary">
                <div className="summary__pico">
                    <h3>
                        Pico:{" "}
                        <span className="summary__highlight">{entry.shortUrl.slice(-10)}</span>
                    </h3>
                    <Copy
                        size={16}
                        className="entry__icon entry__icon-copy"
                        onClick={() => navigator.clipboard.writeText(entry.shortUrl)}
                    />
                </div>
                <div className="summary__long">
                    <h4>
                        Long:{" "}
                        <span className="summary__url">
                            {entry.originalUrl.substring(0, 30)}...
                        </span>
                    </h4>
                    <a href={entry.originalUrl} target="_blank" rel="noreferrer noopener">
                        <ExternalLink size={16} className="entry__icon entry__icon-open" />
                    </a>
                </div>
            </div>
            {showDetails ? (
                <>
                    <ChevronUp
                        size={35}
                        className="entry__icon entry__icon-details"
                        onClick={() => setShowDetails(false)}
                    />
                    <div className="entry__details">
                        <p>
                            Visits: <span className="details__highlight">{entry.visits}</span>
                        </p>
                        <p>
                            Redirects to:{" "}
                            <span className="details__long">
                                {entry.originalUrl}
                                <Pencil
                                    size={16}
                                    className="entry__icon"
                                    onClick={() => setToggleEdit(!toggleEdit)}
                                />
                            </span>
                        </p>
                        {toggleEdit && (
                            <UrlEditForm
                                shortUrl={entry.shortUrl.slice(-10)}
                                originalUrl={entry.originalUrl}
                                closeForm={() => setToggleEdit(false)}
                            />
                        )}
                        <p>Created on: {entryDate.toDateString()}</p>
                        <Trash2
                            size={35}
                            className="entry__icon entry__icon-delete"
                            onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                        />
                        {showDeleteConfirm && (
                            <div className="delete__confirmation">
                                <p className="delete__text">Delete this Pico URL?</p>
                                <button
                                    className="delete__button delete__button-confirm"
                                    onClick={() => handleUrlDelete()}
                                >
                                    Yep
                                </button>
                                <button
                                    className="delete__button delete__button-cancel"
                                    onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                                >
                                    Nope
                                </button>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <ChevronDown
                    size={35}
                    className="entry__icon entry__icon-details"
                    onClick={() => setShowDetails(true)}
                />
            )}
        </div>
    );
}

export default UrlEntry;
