import { useAuthContext } from "../context/AuthContext";

interface UserInfoProps {
    urlCount: number;
}

function UserInfo({ urlCount }: UserInfoProps) {
    const authContext = useAuthContext();

    return (
        <div>
            <h3>{`Hello ${authContext?.userDetails?.name}!`}</h3>
            <p>{`You have ${urlCount} Pico URLs`}</p>
            <button>Log Out!</button>
            <p>Change E-Mail or Password</p>
        </div>
    );
}

export default UserInfo;