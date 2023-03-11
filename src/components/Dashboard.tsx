import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { urlsAPI } from "../services/urlsAPI";
import "../styles/Dashboard.css";

function Dashboard() {
    const authContext = useAuthContext();
    const navigate = useNavigate();
    const [urlCount, setUrlCount] = useState(0);

    useEffect(() => {
        async function getUrlCount(userToken: string) {
            const response = await urlsAPI.getCount(userToken);
            if (!response.error) {
                setUrlCount(response.count);
            }
        }
        if (!authContext?.isLoggedIn || !authContext.userDetails?.token) {
            console.log("User not logged in, redirecting");
            navigate("/");
        } else {
            getUrlCount(authContext.userDetails?.token);
        }
    }, []);

    return (
        <div className="dashboard__container">
            <h1 className="dashboard__title">Pico URL Dashboard</h1>
            <div>{`You have ${urlCount} URLs`}</div>
            <div className="dashboard__upper">
                <div>User Statistics</div>
                <div>Create a picoUrl</div>
            </div>
            <div>Display URLs paginated</div>
        </div>
    );
}

export default Dashboard;