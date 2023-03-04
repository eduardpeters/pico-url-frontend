import { Link } from "react-router-dom";
import RedirectForm from "./RedirectForm";
import "../styles/Root.css";

function Root() {
    return (
        <div className="Root">
            <div className="root__content">
                <h1>Welcome to Pico URL!</h1>
                <RedirectForm />
                <div>Create an account or log in</div>
                <Link to="/login">Log In!</Link>
            </div>
        </div>
    );
}

export default Root;