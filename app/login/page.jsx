"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginCredentials } from "@/_actions/authActions";
import LogInForm from "@/components/forms/LogInForm";
import LogInProviders from "@/components/forms/LogInProviders";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    // design border of the form

    return (
        <div className=" flex flex-col items-center border-b-neutral-500 rounded-box">
            <h1 className="text-4xl m-6">Log in</h1>
            {
                error &&
                <div role="alert" className="alert alert-error alert-soft mb-6">
                    <span>Error! {error}</span>
                </div>
            }
            {
                error === "User not found, please register first" && (
                    <div role="alert" className="alert alert-error alert-soft mb-6">
                        <span>Error! User not found.</span>
                        <Link href="/register">
                            Create an account
                        </Link>
                    </div>
                )
            }
            <div className="border-1 rounded-2xl border-base-300 shadow-2xl p-7 w-100">
                {/*<LogInForm signInAction={loginCredentials} />
                <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-base-300"/>*/}
                <LogInProviders />
            </div>
        </div>
    );
}