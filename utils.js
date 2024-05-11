import twilio from 'twilio';
import crypto from 'crypto';
import schedule from 'node-schedule';


export const getRandomHexValues = (len) => {
    return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
};




const accountSid = 'AC7334186d3844775252e438d61e62fbc3'; 
const authToken = 'c0a3f9fbe8d79d02313c20ddf1399226'; 
const client = twilio(accountSid, authToken);

export function sendReminderSMS(toNumber, messageBody, appointmentDate) {
    const reminderDate = new Date(appointmentDate);
    reminderDate.setDate(reminderDate.getDate() - 1);
    reminderDate.setHours(10, 0, 0, 0);

    client.messages.create({
        from: '+12177591748', 
        to: toNumber,
        body: messageBody,
        sendAt: reminderDate.toISOString(),
    })
    .then(message => console.log(`Reminder SMS scheduled successfully with SID: ${message.sid}`))
    .catch(error => console.error('Error scheduling reminder SMS:', error));
}



