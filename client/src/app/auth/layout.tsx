"use client";
interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return <div className="flex h-full justify-center pt-20">{children}</div>;
};
export default AuthLayout;
