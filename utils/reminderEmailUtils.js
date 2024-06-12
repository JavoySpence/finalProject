import nodemailer from 'nodemailer';
import cron from 'node-cron';
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

async function sendEmail(email, subject, text, html) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: subject,
            text: text,
            html: html
        };

        console.log('Sending email to:', email);
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', email);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email: ' + error.message);
    }
}

export async function sendEmailNotification(email, firstName, lastName, appointmentDate) {
    const subject = 'Appointment Notification';
    const text = `Dear ${firstName} ${lastName}, your appointment is scheduled on ${appointmentDate}.`;
    const html = `
        <p>Dear ${firstName} ${lastName},</p>
        <p>Your appointment is scheduled on ${appointmentDate}.</p>
    `;
    await sendEmail(email, subject, text, html);
}

export async function sendReminderEmail(email, firstName, lastName, appointmentDate) {
    const subject = 'Appointment Reminder';
    const text = `Dear ${firstName} ${lastName}, just a friendly reminder that you have an appointment scheduled on ${appointmentDate}.`;
    const html = `
        <p>Dear ${firstName} ${lastName},</p>
        <p>Just a friendly reminder that you have an appointment scheduled on ${appointmentDate}.</p>
    `;
    await sendEmail(email, subject, text, html);
}

export function scheduleReminderEmail(email, firstName, lastName, appointmentDate) {
    const appointmentDateObj = new Date(appointmentDate);
    const reminderDate = new Date(appointmentDateObj);
    reminderDate.setDate(appointmentDateObj.getDate() - 1);
    reminderDate.setHours(20, 29, 0, 0);

    const now = new Date();
    console.log('Scheduling reminder email for:', reminderDate);
    if (reminderDate > now) {
        const cronExpression = `${reminderDate.getMinutes()} ${reminderDate.getHours()} ${reminderDate.getDate()} ${reminderDate.getMonth() + 1} *`;
        console.log('Cron expression:', cronExpression);
        cron.schedule(cronExpression, async () => {
            console.log('Executing reminder email cron job');
            await sendReminderEmail(email, firstName, lastName, appointmentDate);
        });
    } else {
        console.log('Reminder date is in the past. Skipping scheduling reminder email.');
    }
}

