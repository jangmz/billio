"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    return (
        <div>
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
            { /* rest of the code */ }
        </div>
    );
}