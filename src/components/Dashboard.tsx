import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthContext } from "../context/AuthContext";
import { urlsAPI } from "../services/urlsAPI";
import "../styles/Dashboard.css";
import CreateForm from "./CreateForm";
import RetryModal from "./RetryModal";
import UrlList from "./UrlList";
import UserInfo from "./UserInfo";

function Dashboard() {
    const authContext = useAuthContext();
    const navigate = useNavigate();
    const [urlCount, setUrlCount] = useState(0);
    const [showRetry, setShowRetry] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function getUrlCount() {
            try {
                const response = await urlsAPI.getCount();
                setUrlCount(response.count);
            } catch (error: unknown) {
                setErrorMessage(error instanceof Error ? error.message : "Failed to load count");
                setShowRetry(true);
            }
        }
        if (!authContext?.isLoggedIn || !authContext.userDetails?.token) {
            navigate("/");
        } else {
            getUrlCount();
        }
    }, [authContext?.isLoggedIn, authContext?.userDetails?.token, navigate]);

    return (
        <div className="dashboard__container">
            <h1 className="dashboard__title">Pico URL Dashboard</h1>
            <div className="dashboard__upper">
                <UserInfo urlCount={urlCount} />
                <CreateForm urlCount={urlCount} setUrlCount={setUrlCount} />
            </div>
            <UrlList urlCount={urlCount} setUrlCount={setUrlCount} />
            {showRetry && (
                <RetryModal closeModal={() => setShowRetry(false)} errorMessage={errorMessage} />
            )}
        </div>
    );
}

export default Dashboard;
