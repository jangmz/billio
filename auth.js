import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { getUser, insertUser } from "./_actions/userActions";

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        GitHub,
        Google
    ],
    pages: {
        signIn: "/login",
        error: "/login",
        signOut: "/logout",
    },
    //debug: process.env.NODE_ENV === "development",
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ token, user }) {
            // adding user ID to the token when user logs in
            if (user) {
                // retrieve user ID from database
                const existingUser = await getUser(user.email);

                if (existingUser) {
                    token.id = existingUser.id; // save user ID in token
                } else {
                    console.error("User not found in the database:", user.email);

                    // TODO: check Stripe webhook if user has paid

                    // create new user account
                    console.log("Creating new user account...");
                    const newUser = await insertUser({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                    });

                    // set token id
                    token.id = newUser.id;
                }
            }            
            return token;
        },
        async session({ session, token }) {
            // add user ID from token to the session
            if (session?.user) {
                session.user.id = token.id;
            }
            return session;
        },
    },
});