import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
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
                    <h3>Pico: {entry.shortUrl}</h3>
                    <ContentCopyIcon className="entry__icon" onClick={() => navigator.clipboard.writeText(entry.shortUrl)} />
                </div>
                <div className="summary__long">
                    <h4>Long: {entry.originalUrl.substring(0, 30)}...</h4>
                    <LaunchIcon className="entry__icon" />
                </div>
            </div>
            {
                showDetails ?
                    <>
                        <KeyboardArrowDownIcon className="entry__icon" onClick={() => setShowDetails(false)} />
                        <div className="entry__details">
                            <p>Visits: {entry.visits}</p>
                            <p>Created on: {entry.date}</p>
                        </div>
                    </>
                    :
                    <KeyboardArrowRightIcon className="entry__icon" onClick={() => setShowDetails(true)} />
            }
        </div>
    );
}

export default UrlEntry;