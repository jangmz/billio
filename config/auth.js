import NextAuth from "next-auth";
import MongooseAdapter from "./mongooseAdapter";
import connectDB from "./mongodb";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { signInSchema } from "./zod";
import { getUser } from "@/_actions/userActions";
import bcrypt from "bcryptjs";

await connectDB();
 
export const { handlers, signIn, signOut, auth } = NextAuth({
    //adapter: MongooseAdapter(),
    providers: [
        GitHub,
        /*Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "example@mail.com"},
                password: {  label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // credentials must not be empty
                if (!credentials.email || !credentials.password) {
                    throw new Error("Email and password required");
                }

                // validate credentials
                try {
                    await signInSchema.parseAsync(credentials);
                } catch (error) {
                    if (error instanceof ZodError) {
                        throw new Error(error.errors[0].message);
                    } else {
                        throw new Error("Invalid credentials");
                    }
                }

                // check if user exists and compare password
                const user = await getUser(credentials.email);
                if (user) {
                    const match = await bcrypt.compare(credentials.password, user.password);
                    if (match) {
                        return user;
                    } else {
                        throw new Error("Password does not match");
                    }
                } else {
                    throw new Error("User not found, please register first");
                }
            }
        }),*/
    ],
    pages: {
        signIn: "/login",
        error: "/login",
        signOut: "/logout",
    },
    session: {
        strategy: "jwt"
        //strategy: "database",
        //maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    /*callbacks: {
        async session({ session, user }) {
            if (session?.user) {
              session.user.id = user.id;
            }
            return session;
        },
        async jwt({ token, user }) {
        if (user) {
            token.id = user.id;
        }
        return token;
        }
    },
    debug: process.env.NODE_ENV === "development"*/
});