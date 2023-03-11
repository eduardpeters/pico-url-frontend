import { ResultDetailsInterface } from "../types/picotypes";

interface ResultModalProps {
    closeModal: () => void;
    details: ResultDetailsInterface | null;
}

function ResultModal({ closeModal, details }: ResultModalProps) {
    return (
        <div>
            <h3>{details?.message}</h3>
            <p>{details?.isError ? "Not OK" : "Is OK"}</p>
            {details?.picoUrl && <a href={details.picoUrl}>{details.picoUrl}</a>}
            <button onClick={closeModal}>Alrighty!</button>
        </div>
    );
}

export default ResultModal;