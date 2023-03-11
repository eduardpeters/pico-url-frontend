import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usersAPI } from "../services/usersAPI";
import styles from "../styles/general.module.css";
import "../styles/Register.css";

function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("OK");

    async function handleRegister(event: React.FormEvent) {
        event.preventDefault();
        if (validateRegisterForm(name, email, password, confirmPassword)) {
            const response = await usersAPI.postRegister(name, email, password);
            if (response.error) {
                showErrorMessage(response.error);
            }
            else {
                navigate("/login");
            }
        }
    }

    function validateRegisterForm(name: string, email: string, password: string, confirmPassword: string): boolean {
        if (!name) {
            showErrorMessage("Please provide a name");
            return false;
        }
        if (!email) {
            showErrorMessage("Please provide a valid email");
            return false;
        }
        if (!password) {
            showErrorMessage("Please provide a password");
            return false;
        }
        if (password.length < 5) {
            showErrorMessage("Password must be at least 5 characters");
            return false;
        }
        if (password !== confirmPassword) {
            showErrorMessage("Passwords do not match");
            return false;
        }
        return true;
    }

    function showErrorMessage(text: string) {
        setErrorMessage(text);
        setTimeout(() => setErrorMessage("OK"), 3000);
    }

    return (
        <div className={styles.container}>
            <div className="register__content">
                <h1 className={styles.title}>Pico URL Registration</h1>
                <h3 className={styles.subtitle}>Please enter your new user details</h3>
                <h4 className="form__error" style={{ visibility: errorMessage.length > 2 ? "visible" : "hidden" }}>{errorMessage}</h4>
                <form className="form__container" onSubmit={event => handleRegister(event)}>
                    <div className="form__field">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            required
                            value={name}
                            onChange={event => setName(event.target.value)}
                        ></input>
                    </div>
                    <div className="form__field">
                        <label htmlFor="email">E-Mail</label>
                        <input
                            type="email"
                            id="email"
                            required 
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                        ></input>
                    </div>
                    <div className="form__field">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            required
                            value={password}
                            onChange={event => setPassword(event.target.value)}
                        ></input>
                    </div>
                    <div className="form__field">
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm-password"
                            required
                            value={confirmPassword}
                            onChange={event => setConfirmPassword(event.target.value)}
                        ></input>
                    </div>
                    <button className="form__button" type="submit">Register!</button>
                </form>
                <div className={styles.links}>
                    <Link to="/login">Log In!</Link>
                    <Link to="/">Return home</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;