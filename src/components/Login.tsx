import { useState } from "react";
import { Link } from "react-router-dom";
import { authAPI } from "../services/authAPI";
import styles from "../styles/general.module.css";
import "../styles/Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    async function handleLogIn(event: React.FormEvent) {
        event.preventDefault();
        console.log("Ready to send");
        const response = await authAPI.postLogIn(email, password);
        if (response.error) {
            setErrorMessage(response.error);
        }
        else {
            console.log("Login success:", response);
        }
    }

    return (
        <div className={styles.container}>
            <div className="login__content">
                <h3 className={styles.subtitle}>Please enter your e-mail and password</h3>
                <p className="form__error">{errorMessage}</p>
                <form className="form__container" onSubmit={event => handleLogIn(event)}>
                    <div className="form__field">
                        <label htmlFor="email">E-Mail</label>
                        <input type="email" id="email" required onChange={event => setEmail(event.target.value)}></input>
                    </div>
                    <div className="form__field">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" required onChange={event => setPassword(event.target.value)}></input>
                    </div>
                    <button className="form__button" type="submit">Log In!</button>
                </form>
                <div className={styles.links}>
                    <Link to="/">Return home</Link>
                    <Link to="/register">Register!</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;