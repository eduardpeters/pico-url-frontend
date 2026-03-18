import { useNavigate } from "react-router";
import { useAuthContext } from "../context/AuthContext";
import useUrlCountQuery from "../hooks/useUrlCountQuery";
import "../styles/UserInfo.css";

function UserInfo() {
    const authContext = useAuthContext();
    const navigate = useNavigate();
    const { data } = useUrlCountQuery();
    const urlCount: number = data?.count ?? 0;

    function handleLogout() {
        localStorage.removeItem("auth");
        authContext?.setUserDetails(null);
        authContext?.setIsLoggedIn(false);
        navigate("/");
    }

    return (
        <div className="info__container">
            <h3>
                Hello, <span className="info__highlight">{authContext?.userDetails?.name}</span>!
            </h3>
            <p>
                You have <span className="info__highlight">{urlCount}</span>
                {` Pico URL${urlCount !== 1 ? "s" : ""}`}
            </p>
            <button className="info__logout" onClick={handleLogout}>
                Log Out!
            </button>
            <p className="info__edit">Change E-Mail or Password</p>
        </div>
    );
}

export default UserInfo;
