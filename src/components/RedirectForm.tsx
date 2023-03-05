import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RedirectForm.css";

function RedirectForm() {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');

    function handleRedirectSubmit(event: React.FormEvent) {
        event.preventDefault();
        const shortUrl = inputValue.length === 10 ? inputValue : inputValue.substring(inputValue.length - 10);
        navigate(`/${shortUrl}`);
    }

    return (
        <form className="redirect__container" onSubmit={event => handleRedirectSubmit(event)}>
            <input
                className="redirect__input"
                type="text"
                minLength={10}
                placeholder="p1C0_uRL!!"
                required
                onChange={event => setInputValue(event.target.value)}
            >
            </input>
            <button className="redirect__button" type="submit">Magnify!</button>
        </form>
    )
}

export default RedirectForm;