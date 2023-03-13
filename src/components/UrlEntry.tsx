import { UrlInterface } from "../types/picotypes";
import "../styles/UrlEntry.css";

interface UrlEntryProps {
    entry: UrlInterface;
}

function UrlEntry({entry}: UrlEntryProps) {
    return (
        <div className="entry__container">
            <p>{entry.shortUrl}</p>
            <p>{entry.originalUrl}</p>
            <p>{entry.visits}</p>
        </div>
    );
}

export default UrlEntry;