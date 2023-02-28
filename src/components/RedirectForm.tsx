import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RedirectForm() {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');

    function handleRedirectSubmit(event: React.FormEvent) {
        event.preventDefault();
        const shortUrl = inputValue.length === 10 ? inputValue : inputValue.substring(inputValue.length - 10);
        navigate(`/${shortUrl}`);
    }

    return (
        <div className="Redirect-form">
            <form onSubmit={event => handleRedirectSubmit(event)}>
                <input
                    type="text"
                    minLength={10}
                    placeholder="Enter a Pico URL address or the 10 character ID"
                    required
                    onChange={event => setInputValue(event.target.value)}
                >
                </input>
                <button type="submit">Magnify!</button>
            </form>
        </div>
    )
}

export default RedirectForm;