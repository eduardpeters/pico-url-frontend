import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../context/AuthContext";
import { urlsAPI } from "../services/urlsAPI";

function useUrlsQuery() {
    const authContext = useAuthContext();
    const token = authContext?.userDetails?.token;

    return useQuery({
        queryKey: ["urls"],
        queryFn: urlsAPI.getUrls,
        enabled: !!token,
    });
}

export default useUrlsQuery;
