import { LS } from "@/lib/constants";
import { getCurrentUserKey } from "@/lib/keys";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useLogout = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    const logout = () => {
        localStorage.removeItem(LS.JWT_TOKEN_KEY);
        localStorage.removeItem(LS.JWT_TOKEN_EXPIRY_KEY);
        queryClient.invalidateQueries({ queryKey: getCurrentUserKey() });
        toast.success("Logged out Successfully");
        onSuccess?.();
    };

    return { logout };
};
