import { Link } from "react-router-dom";
import RedirectForm from "./RedirectForm";
import styles from "../styles/general.module.css";
import "../styles/Root.css";

function Root() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Welcome to Pico URL!</h1>
                <p className={styles.text}>A minimalistic URL shortening service</p>
                <h3 className={styles.subtitle}>Begin your journey right away</h3>
                <p>Use the form below for your Pico URL link or enter it directly in your browser's navigation bar</p>
                <RedirectForm />
                <h3 className={styles.subtitle}>Create or log into your account</h3>
                <p>Only registered members can create and manage Pico URLs</p>
                <div className={styles.links}>
                    <Link to="/login">Log In!</Link>
                    <Link to="/register">Register!</Link>
                </div>
            </div>
        </div>
    );
}

export default Root;