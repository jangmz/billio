"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import LogInForm from "@/components/LogInForm";
import { loginCredentials, loginGitHub } from "@/_actions/authActions";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    return (
        <div>
            <h1>Login</h1>
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
            {/*<LogInForm signInAction={loginCredentials} />*/}
            <hr />
            <button onClick={loginGitHub}>
                Sign In with GitHub
            </button>
        </div>
    );
}