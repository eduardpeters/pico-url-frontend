import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LaunchIcon from "@mui/icons-material/Launch";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { UrlInterface } from "../types/picotypes";
import "../styles/UrlEntry.css";
import { useState } from 'react';

interface UrlEntryProps {
    entry: UrlInterface;
}

function UrlEntry({ entry }: UrlEntryProps) {
    const [showDetails, setShowDetails] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const entryDate = new Date(entry.date);

    function handleUrlDelete() {
        console.log("URL will be deleted");
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
                            <p>Redirects to: <span className="details__long">{entry.originalUrl}</span></p>
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