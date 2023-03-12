import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ResultDetailsInterface } from "../types/picotypes";
import "../styles/ResultModal.css";

interface ResultModalProps {
    closeModal: () => void;
    details: ResultDetailsInterface | null;
}

function ResultModal({ closeModal, details }: ResultModalProps) {

    function handleOutsideClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    }

    function copyPicoUrl() {
        if (details?.picoUrl) {
            navigator.clipboard.writeText(details?.picoUrl);
        }
    }

    return (
        <div className="modal__container" onClick={event => handleOutsideClick(event)}>
            <div className="modal__content">
                <h3 className={details?.isError ? "content__error" : "content__good"}>{details?.message}</h3>
                {details?.picoUrl && 
                    <div className="url__container">
                        <a href={details.originalUrl} target="_blank" rel="noreferrer noopener">{details.picoUrl}</a>
                        <ContentCopyIcon onClick={copyPicoUrl} />
                    </div>
                }
                <button className="modal__button" onClick={closeModal}>Alrighty!</button>
            </div>
        </div>
    );
}

export default ResultModal;