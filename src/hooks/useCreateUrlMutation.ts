import { useMutation, useQueryClient } from "@tanstack/react-query";
import { urlsAPI } from "../services/urlsAPI";

function useCreateUrlMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (originalUrl: string) => urlsAPI.postUrl(originalUrl),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["urls"] });
            queryClient.invalidateQueries({ queryKey: ["urlCount"] });
        },
    });
}

export default useCreateUrlMutation;
