"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import LogInForm from "@/components/LogInForm";
import { loginCredentials, loginGitHub } from "@/_actions/authActions";
import Button from "@/components/buttons/Button";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    // design border of the form

    return (
        <div className=" flex flex-col items-center border-b-neutral-500 rounded-box">
            <h1 className="text-4xl mt-6">Log in</h1>
            {
                error === "User not found, please register first" && (
                    <div>
                        <h3>User not found, please register first</h3>
                        <Link href="/register">
                            Create an account
                        </Link>
                    </div>
                )
            }
            <LogInForm signInAction={loginCredentials} />
            
            <div className="flex flex-col gap-3">
                <Button 
                    text="Log in with GitHub"
                    btnStyle={"btn-primary"}
                    onClick={loginGitHub}
                />
                <Button 
                    text={"Log in with Google"}
                />
            </div>
        </div>
    );
}