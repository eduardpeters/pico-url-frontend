import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthContext } from "../context/AuthContext";
import { authAPI } from "../services/authAPI";
import styles from "../styles/general.module.css";
import "../styles/Login.css";

function Login() {
    const authContext = useAuthContext();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("OK");

    async function handleLogIn(event: React.FormEvent) {
        event.preventDefault();
        if (validateLoginForm(email, password)) {
            try {
                const response = await authAPI.postLogIn(email, password);
                const userDetails = {
                    id: response._id,
                    name: response.name,
                    email: response.email,
                    token: response.token,
                };
                localStorage.setItem("auth", JSON.stringify(userDetails));
                authContext?.setIsLoggedIn(true);
                authContext?.setUserDetails(userDetails);
                navigate("/dashboard");
            } catch (error: unknown) {
                showErrorMessage(error instanceof Error ? error.message : "Login failed");
            }
        }
    }

    function validateLoginForm(email: string, password: string): boolean {
        if (!email || !password) {
            showErrorMessage("Please provide an e-mail and password");
            return false;
        }
        if (password.length < 5) {
            showErrorMessage("Password must be at least 5 characters");
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
            <div className="login__content">
                <h1 className={styles.title}>Pico URL Login</h1>
                <h3 className={styles.subtitle}>Please enter your e-mail and password</h3>
                <h4
                    className="form__error"
                    style={{ visibility: errorMessage.length > 2 ? "visible" : "hidden" }}
                >
                    {errorMessage}
                </h4>
                <form className="form__container" onSubmit={(event) => handleLogIn(event)}>
                    <div className="form__field">
                        <label htmlFor="email">E-Mail</label>
                        <input
                            type="email"
                            id="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        ></input>
                    </div>
                    <div className="form__field">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        ></input>
                    </div>
                    <button className="form__button" type="submit">
                        Log In!
                    </button>
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
