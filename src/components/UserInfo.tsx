import { useAuthContext } from "../context/AuthContext";
import "../styles/UserInfo.css";

interface UserInfoProps {
    urlCount: number;
}

function UserInfo({ urlCount }: UserInfoProps) {
    const authContext = useAuthContext();

    return (
        <div className="info__container">
            <h3>Hello, <span className="info__highlight">{authContext?.userDetails?.name}</span>!</h3>
            <p>You have <span className="info__highlight">{urlCount}</span> Pico URLs</p>
            <button className="info__logout">Log Out!</button>
            <p className="info__edit">Change E-Mail or Password</p>
        </div>
    );
}

export default UserInfo;