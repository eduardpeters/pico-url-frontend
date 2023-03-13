import { useNavigate } from "react-router-dom";
import "../styles/ResultModal.css";

interface RetryModalProps {
    closeModal: () => void;
    errorMessage: string;
}

function RetryModal({ closeModal, errorMessage }: RetryModalProps) {
    const navigate = useNavigate();

    function handleOutsideClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    }

    function refreshPage() {
        closeModal();
        navigate(0);
    }

    function exitHome() {
        closeModal();
        navigate("/");
    }

    return (
        <div className="modal__container" onClick={event => handleOutsideClick(event)}>
            <div className="modal__content">
                <h3 className="content__error">{errorMessage}</h3>
                <button className="modal__button-retry" onClick={refreshPage}>Retry Load!</button>
                <button className="modal__button-exit" onClick={exitHome}>Exit</button>
            </div>
        </div>
    );
}

export default RetryModal;