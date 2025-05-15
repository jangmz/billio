import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
    const { name, email, formName, message } = await req.json();

    console.log("created transporter");
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    try {
        console.log("sending email");
        await transporter.sendMail({
            from: process.env.GMAIL_USERNAME,
            to: process.env.APP_SUPPORT,
            subject: `New message from Billio (${formName})`,
            text: `Email: ${email}\nUsername: ${name}\nMessage:\n${message}`,
            replyTo: email,
        })

        console.log("email sent");
        return NextResponse.json({ message: "Email sent successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: `Failed to send email: ${error.message}` });
    }
}