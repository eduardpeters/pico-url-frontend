import { UrlInterface } from "../types/picotypes";
import useUrlsQuery from "../hooks/useUrlsQuery";
import UrlEntry from "./UrlEntry";
import "../styles/UrlEntry.css";

function UrlList() {
    const { data: userUrls, isPending, isError, error } = useUrlsQuery();

    if (isPending) {
        return <div className="list__container">Loading...</div>;
    }

    if (isError) {
        return (
            <div className="list__container">
                {error instanceof Error ? error.message : "Failed to load URLs"}
            </div>
        );
    }

    return (
        <div className="list__container">
            {(userUrls as UrlInterface[]).map((entry) => (
                <UrlEntry key={entry._id} entry={entry} />
            ))}
        </div>
    );
}

export default UrlList;
