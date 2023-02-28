import { Link } from "react-router-dom";
import RedirectForm from "./RedirectForm";

function Root() {
    return (
        <div className="Root">
            <h1>Welcome to Pico URL!</h1>
            <RedirectForm />
            <div>Create an account or log in</div>
        <Link to="/login">Log In!</Link>
        </div>
    );
}

export default Root;