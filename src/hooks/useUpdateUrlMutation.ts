import { useMutation, useQueryClient } from "@tanstack/react-query";
import { urlsAPI } from "../services/urlsAPI";

interface UpdateUrlParams {
    shortUrl: string;
    newUrl: string;
}

function useUpdateUrlMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ shortUrl, newUrl }: UpdateUrlParams) => urlsAPI.patchUrl(shortUrl, newUrl),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["urls"] });
        },
    });
}

export default useUpdateUrlMutation;
