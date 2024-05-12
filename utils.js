import twilio from 'twilio';
import crypto from 'crypto';
import schedule from 'node-schedule';

// Import your database pool or any other method to interact with your database
// import pool from './your-database-pool-file';

export const getRandomHexValues = (len) => {
    return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
};

const accountSid = 'AC7334186d3844775252e438d61e62fbc3';
const authToken = 'c0a3f9fbe8d79d02313c20ddf1399226';
const client = twilio(accountSid, authToken);
export async function sendSMS(phone, messageBody, reminderTime, scheduleType) {
    try {
        const message = await client.messages.create({
            from: '+12177591748', 
            to: '+18767840168',
            body: "hi",
            sendAt: reminderTime.toISOString(),
            // messagingServiceSid: 'MG4ee19c73736595193d66ac45ca3a42e1',
            // schedule: {
            //     sendAt: reminderTime.toISOString(),
            //     type: scheduleType || 'at' // Default to 'at' if scheduleType is not provided
            // }
        });
        
        console.log(`Reminder SMS scheduled successfully with SID: ${message.sid}`);
        return message.sid;
    } catch (error) {
        console.error('Error scheduling reminder SMS:', error);
        throw error;
    }
}

