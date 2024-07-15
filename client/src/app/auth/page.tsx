"use client";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthPageProps {}

const AuthPage: React.FC<AuthPageProps> = ({}) => {
    return (
        <>
            <Tabs defaultValue="login" className="">
                <TabsList className="grid h-fit w-full grid-cols-2">
                    <TabsTrigger value="login" className="py-3">
                        Login
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="py-3">
                        Signup
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="animate-in">
                    <LoginForm />
                </TabsContent>
                <TabsContent value="signup" className="animate-in">
                    <SignupForm />
                </TabsContent>
            </Tabs>
        </>
    );
};
export default AuthPage;
