import { useMutation, useQueryClient } from "@tanstack/react-query";
import { urlsAPI } from "../services/urlsAPI";

function useDeleteUrlMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (shortId: string) => urlsAPI.deleteUrl(shortId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["urls"] });
            queryClient.invalidateQueries({ queryKey: ["urlCount"] });
        },
    });
}

export default useDeleteUrlMutation;
