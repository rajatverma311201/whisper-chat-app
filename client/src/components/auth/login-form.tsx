import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/auth/use-login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export const LoginForm = () => {
	const { login, isLoading } = useLogin();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		const email = values.email!;
		const password = values.password!;
		login(
			{ email, password },
			{
				onSuccess: () => {
					form.reset();
				},
			},
		);
	}

	return (
		<Card className="h-fit w-full sm:w-[500px]">
			<CardHeader>
				<CardTitle className="text-primary">Login</CardTitle>
				{/* <CardDescription className="flex justify-center gap-5">
                    <ProviderAuth provider={PROVIDER.GOOGLE} Icon={FcGoogle} />
                    <ProviderAuth provider={PROVIDER.GITHUB} Icon={FaGithub} />
                </CardDescription> */}
			</CardHeader>
			<Separator className="mb-5" />
			{/* <h1 className="my-4 text-center text-xl font-medium text-secondary-foreground">
                OR
            </h1> */}

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className="space-y-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											placeholder="example@example.com"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Please enter your email.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="********"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Password should not be less than 8
										characters.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
					<CardFooter className="">
						<Button
							disabled={isLoading}
							type="submit"
							className="w-full disabled:cursor-not-allowed"
						>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 animate-spin text-primary-foreground" />{" "}
									Please wait
								</>
							) : (
								"Submit"
							)}
						</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
};
