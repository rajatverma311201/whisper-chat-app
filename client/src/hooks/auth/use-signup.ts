import { LS } from "@/lib/constants";
import { getCurrentUserKey } from "@/lib/keys";
import { signup as apiSignup } from "@/services/apiAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface MutationFnArgs {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

export const useSignup = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const {
        mutate: signup,
        isPending: isLoading,
        error,
    } = useMutation({
        mutationFn: ({
            name,
            email,
            password,
            passwordConfirm,
        }: MutationFnArgs) => {
            return apiSignup(name, email, password, passwordConfirm);
        },
        onSuccess: (data) => {
            localStorage.setItem(
                LS.JWT_TOKEN_KEY,
                data[LS.JWT_TOKEN_KEY] as string,
            );
            localStorage.setItem(
                LS.JWT_TOKEN_EXPIRY_KEY,
                data[LS.JWT_TOKEN_EXPIRY_KEY] as string,
            );
            toast.dismiss();
            toast.success("Logged in Successfully");
            queryClient.invalidateQueries({ queryKey: getCurrentUserKey() });
            router.replace("/");
        },
        onError: (error: Error) => {
            toast.dismiss();
            toast.error(error.message);
        },
    });

    return {
        signup,
        isLoading,
        error,
    };
};
