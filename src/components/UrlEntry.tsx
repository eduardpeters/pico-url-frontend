import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LaunchIcon from "@mui/icons-material/Launch";
import { UrlInterface } from "../types/picotypes";
import "../styles/UrlEntry.css";
import { useState } from 'react';

interface UrlEntryProps {
    entry: UrlInterface;
}

function UrlEntry({ entry }: UrlEntryProps) {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="entry__container">
            <div className="entry__summary">
                <div className="summary__pico">
                    <h3>Pico: <span className="entry__highlight">{entry.shortUrl.slice(-10)}</span></h3>
                    <ContentCopyIcon className="entry__icon entry__icon-copy" onClick={() => navigator.clipboard.writeText(entry.shortUrl)} />
                </div>
                <div className="summary__long">
                    <h4>Long: {entry.originalUrl.substring(0, 30)}...</h4>
                    <LaunchIcon className="entry__icon entry__icon-open" />
                </div>
            </div>
            {
                showDetails ?
                    <>
                        <ExpandLessIcon fontSize="large" className="entry__icon entry__icon-details" onClick={() => setShowDetails(false)} />
                        <div className="entry__details">
                            <p>Visits: {entry.visits}</p>
                            <p>Created on: {entry.date}</p>
                        </div>
                    </>
                    :
                    <ExpandMoreIcon fontSize="large" className="entry__icon entry__icon-details" onClick={() => setShowDetails(true)} />
            }
        </div>
    );
}

export default UrlEntry;