import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div className="NotFound">
            <h1>404 Not Found</h1>
            <h3>Thank you for using Pico URL</h3>
            <h3>Sadly, we could not find the page you were looking for</h3>
            <Link to="/">Return to Homepage</Link>
        </div>
    );
}

export default NotFound;