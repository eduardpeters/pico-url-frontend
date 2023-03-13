import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import "../styles/UserInfo.css";

interface UserInfoProps {
    urlCount: number;
}

function UserInfo({ urlCount }: UserInfoProps) {
    const authContext = useAuthContext();
    const navigate = useNavigate();

    function handleLogout() {
        authContext?.setUserDetails(null);
        authContext?.setIsLoggedIn(false);
        navigate("/");
    }

    return (
        <div className="info__container">
            <h3>Hello, <span className="info__highlight">{authContext?.userDetails?.name}</span>!</h3>
            <p>You have <span className="info__highlight">{urlCount}</span>{` Pico URL${urlCount !== 1 ? 's' : ''}`}</p>
            <button className="info__logout" onClick={handleLogout}>Log Out!</button>
            <p className="info__edit">Change E-Mail or Password</p>
        </div>
    );
}

export default UserInfo;