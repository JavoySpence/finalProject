import cron from 'node-cron';
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

export async function sendReminderEmail(email, firstName, lastName, appointmentDate) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email, 
            subject: 'Appointment Reminder',
            text: `Dear ${firstName} ${lastName}, just a friendly reminder that you have an appointment scheduled on ${appointmentDate}.`,
            html: `
            <p>Dear ${firstName} ${lastName},</p>
            <p>Just a friendly reminder that you have an appointment scheduled on ${appointmentDate}.</p>
        `
        };

        await transporter.sendMail(mailOptions);
        console.log('Reminder email sent successfully.');
    } catch (error) {
        console.error('Error sending reminder email:', error);
        throw new Error('Failed to send reminder email: ' + error.message);
    }
}

export function schedulePersonalizedReminderEmail(email, firstName, lastName, appointmentDate) {
    cron.schedule('12 9 * * *', async () => {
        try {
            await sendReminderEmail();
        } catch (error) {
            console.error('Error scheduling reminder email:', error);
        }
    }).start();
}