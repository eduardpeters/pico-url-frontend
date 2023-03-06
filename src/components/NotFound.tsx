import { Link, useLocation } from "react-router-dom";
import styles from "../styles/general.module.css";
import "../styles/NotFound.css";

function NotFound() {
    const { state } = useLocation();

    return (
        <div className={styles.container}>
            <h1 className="not-found__error">{state.error}</h1>
            <h3>Thank you for using Pico URL</h3>
            <h3>Sadly, we could not retrieve the page you were looking for</h3>
            <Link to="/">Return to Homepage</Link>
        </div>
    );
}

export default NotFound;