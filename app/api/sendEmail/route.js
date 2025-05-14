import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export default async function handler(req) {
    if (req.method !== "POST") {
        return NextResponse({ message: "Only POST requests allowed." });
    }

    if (req.method === "POST") {
        const { name, email, message } = req.body;

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: process.env.GMAIL_USERNAME,
                pass: process.env.GMAIL_PASSWORD,
            },
        });

        try {
            await transporter.sendMail({
                from: process.env.GMAIL_USERNAME,
                to: process.env.APP_SUPPORT,
                subject: `New message from Billio`,
                text: `${name} said: ${message}`,
                replyTo: email,
            })

            return NextResponse({ message: "Email sent successfully" });
        } catch (error) {
            console.error(error);
            return NextResponse({ error: `Failed to send email: ${error.message}` });
        }
    }
}