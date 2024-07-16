"use client";
import { LS } from "@/lib/constants";
import { getCurrentUserKey } from "@/lib/keys";
import { login as apiLogin } from "@/services/apiAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
interface MutationFnArgs {
    email: string;
    password: string;
}

export const useLogin = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const {
        mutate: login,
        isPending: isLoading,
        error,
    } = useMutation({
        mutationFn: ({ email, password }: MutationFnArgs) => {
            return apiLogin(email, password);
        },
        onSuccess: (data) => {
            toast.dismiss();

            toast.success("Logged in Successfully");
            localStorage.setItem(
                LS.JWT_TOKEN_KEY,
                data[LS.JWT_TOKEN_KEY] as string,
            );
            localStorage.setItem(
                LS.JWT_TOKEN_EXPIRY_KEY,
                data[LS.JWT_TOKEN_EXPIRY_KEY] as string,
            );
            queryClient.invalidateQueries({ queryKey: getCurrentUserKey() });

            router.replace("/");
        },
        onError: (error: Error) => {
            toast.dismiss();

            toast.error(error.message);
        },
    });

    return {
        login,
        isLoading,
        error,
    };
};
