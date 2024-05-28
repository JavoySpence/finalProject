import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
});

export async function sendEmailNotification(email, firstName, lastName, appointmentDate) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email, 
            subject: 'Appointment Confirmation',
            text: `Dear ${firstName} ${lastName}, your appointment on ${appointmentDate} has been confirmed.`
        };

        await transporter.sendMail(mailOptions);
        console.log('Email notification sent successfully.');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email notification: ' + error.message);
    }
}
