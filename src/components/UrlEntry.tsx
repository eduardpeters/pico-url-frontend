import { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LaunchIcon from "@mui/icons-material/Launch";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import UrlEditForm from "./UrlEditForm";
import { UrlInterface } from "../types/picotypes";
import { urlsAPI } from "../services/urlsAPI";
import "../styles/UrlEntry.css";

interface UrlEntryProps {
    entry: UrlInterface;
    userToken: string | undefined;
    urlCount: number;
    setUrlCount: React.Dispatch<React.SetStateAction<number>>;
}

function UrlEntry({ entry, userToken, urlCount, setUrlCount }: UrlEntryProps) {
    const [showDetails, setShowDetails] = useState(false);
    const [toggleEdit, setToggleEdit] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const entryDate = new Date(entry.date);

    async function handleUrlDelete() {
        if (userToken) {
            const response = await urlsAPI.deleteUrl(userToken, entry.shortUrl.slice(-10))
            if ((response as { error: string }).error) {
                console.error((response as { error: string }).error);
            } else {
                setUrlCount(urlCount - 1);
            }
        }
    }

    return (
        <div className="entry__container">
            <div className="entry__summary">
                <div className="summary__pico">
                    <h3>Pico: <span className="summary__highlight">{entry.shortUrl.slice(-10)}</span></h3>
                    <ContentCopyIcon className="entry__icon entry__icon-copy" onClick={() => navigator.clipboard.writeText(entry.shortUrl)} />
                </div>
                <div className="summary__long">
                    <h4>Long: <span className="summary__url">{entry.originalUrl.substring(0, 30)}...</span></h4>
                    <a href={entry.originalUrl} target="_blank" rel="noreferrer noopener">
                        <LaunchIcon className="entry__icon entry__icon-open" />
                    </a>
                </div>
            </div>
            {
                showDetails ?
                    <>
                        <ExpandLessIcon fontSize="large" className="entry__icon entry__icon-details" onClick={() => setShowDetails(false)} />
                        <div className="entry__details">
                            <p>Visits: <span className="details__highlight">{entry.visits}</span></p>
                            <p>Redirects to: <span className="details__long">{entry.originalUrl}<EditIcon className="entry__icon" onClick={() => setToggleEdit(!toggleEdit)} /></span></p>
                            {
                                toggleEdit
                                &&
                                <UrlEditForm originalUrl={entry.originalUrl} userToken={userToken as string} closeForm={() => setToggleEdit(false)} />
                            }
                            <p>Created on: {entryDate.toDateString()}</p>
                            <DeleteForeverIcon fontSize="large" className="entry__icon entry__icon-delete" onClick={() => setShowDeleteConfirm(!showDeleteConfirm)} />
                            {
                                showDeleteConfirm
                                &&
                                <div className="delete__confirmation">
                                    <p className="delete__text">Delete this Pico URL?</p>
                                    <button className="delete__button delete__button-confirm" onClick={() => handleUrlDelete()}>Yep</button>
                                    <button className="delete__button delete__button-cancel" onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}>Nope</button>
                                </div>
                            }
                        </div>
                    </>
                    :
                    <ExpandMoreIcon fontSize="large" className="entry__icon entry__icon-details" onClick={() => setShowDetails(true)} />
            }
        </div>
    );
}

export default UrlEntry;