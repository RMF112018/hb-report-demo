// src/main/emailService.js
// Email service for sending messages via Outlook SMTP, such as email confirmation
// Import into ipc.js or other main process files to send emails
// Reference: https://nodemailer.com/about/
// *Additional Reference*: https://support.microsoft.com/en-us/office/pop-imap-and-smtp-settings-8361e398-8af4-4e97-b147-6c6c4ac95353
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import logger from './logger.js';
import config from './config.js';

// Configure transporter for Outlook SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER || 'your-email@outlook.com', // Your Outlook email
    pass: process.env.EMAIL_PASS || 'your-app-specific-password', // App-specific password or account password
  },
});

async function sendConfirmationEmail(email, token) {
  const verificationLink = `hb-report://verify-email?token=${token}`; // Custom protocol for Electron app
  const mailOptions = {
    from: `"HB Report" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your HB Report Account',
    text: `Please verify your email by clicking this link: ${verificationLink}`,
    html: `
      <h2>Welcome to HB Report!</h2>
      <p>Please verify your email address to complete your account setup.</p>
      <a href="${verificationLink}" style="padding: 10px 20px; background-color: #0060a9; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p>${verificationLink}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Confirmation email sent to ${email} with token ${token}`);
    return true;
  } catch (error) {
    logger.error(`Failed to send confirmation email to ${email}`, { error: error.message, stack: error.stack });
    throw error;
  }
}

function generateToken() {
  return uuidv4(); // Generates a unique token
}

export { sendConfirmationEmail, generateToken };