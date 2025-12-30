import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp:true,
    
    sendVerificationEmail: async ({ user, url, token }, request) => {
      // console.log({user,url,token});
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Prisma blog" <prismablog@example.com>',
          to: user.email,
          subject: "Please verify your email",
          html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f5f7fa;
      font-family: Arial, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    }
    h1 {
      color: #2d3748;
      font-size: 24px;
      margin-bottom: 16px;
      text-align: center;
    }
    p {
      color: #4a5568;
      font-size: 16px;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 14px 24px;
      margin-top: 20px;
      background: #4f46e5;
      color: #ffffff !important;
      font-size: 16px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: bold;
    }
    .footer {
      margin-top: 30px;
      font-size: 13px;
      color: #718096;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Verify Your Email</h1>

    <p>Hello 👋 ${user.name},</p>

    <p>Thank you for signing up! Please confirm your email address by clicking the button below. This helps us ensure your account is secure and lets you access all features of our platform.</p>

    <p style="text-align:center;">
      <a href="${verificationUrl}" class="button">Verify Email</a>
    </p>

    <p>If the button doesn't work, copy and paste the link below into your browser:</p>

    <p style="word-break: break-all; color:#2b6cb0;">
      ${verificationUrl}
    </p>

    <p>If you did not create an account, you can safely ignore this email.</p>

    <div class="footer">
      <p>© ${new Date().getFullYear()} Prisma Blog. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`,
        });
        console.log("Message sent:", info.messageId);
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  },
});
