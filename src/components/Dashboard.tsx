import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthContext } from "../context/AuthContext";
import useUrlCountQuery from "../hooks/useUrlCountQuery";
import "../styles/Dashboard.css";
import CreateForm from "./CreateForm";
import RetryModal from "./RetryModal";
import UrlList from "./UrlList";
import UserInfo from "./UserInfo";

function Dashboard() {
    const authContext = useAuthContext();
    const navigate = useNavigate();
    const { isError, error } = useUrlCountQuery();

    useEffect(() => {
        if (!authContext?.isLoggedIn || !authContext.userDetails?.token) {
            navigate("/");
        }
    }, [authContext?.isLoggedIn, authContext?.userDetails?.token, navigate]);

    return (
        <div className="dashboard__container">
            <h1 className="dashboard__title">Pico URL Dashboard</h1>
            <div className="dashboard__upper">
                <UserInfo />
                <CreateForm />
            </div>
            <UrlList />
            {isError && (
                <RetryModal
                    closeModal={() => {}}
                    errorMessage={error instanceof Error ? error.message : "Failed to load count"}
                />
            )}
        </div>
    );
}

export default Dashboard;
