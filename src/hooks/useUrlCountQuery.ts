import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../context/AuthContext";
import { urlsAPI } from "../services/urlsAPI";

function useUrlCountQuery() {
    const authContext = useAuthContext();
    const token = authContext?.userDetails?.token;

    return useQuery({
        queryKey: ["urlCount"],
        queryFn: urlsAPI.getCount,
        enabled: !!token,
    });
}

export default useUrlCountQuery;
