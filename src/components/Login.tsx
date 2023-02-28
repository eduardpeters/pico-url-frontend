import { useState } from "react";
import { authAPI } from "../services/authAPI";

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
        <div className="Login">
            {errorMessage.length ? <h3>{errorMessage}</h3> : null}
            <h3>Please enter your e-mail and password</h3>
            <form onSubmit={event => handleLogIn(event)}>
                <label htmlFor="email">E-Mail:</label>
                <input type="email" id="email" required onChange={event => setEmail(event.target.value)}></input>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" required onChange={event => setPassword(event.target.value)}></input>
                <button type="submit">Log In</button>
            </form>
        </div>
    );
}

export default Login;