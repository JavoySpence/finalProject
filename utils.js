import twilio from 'twilio';
import crypto from 'crypto';
import schedule from 'node-schedule';


export const getRandomHexValues = (len) => {
    return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
};


const accountSid = 'AC7334186d3844775252e438d61e62fbc3'; 
const authToken = 'c0a3f9fbe8d79d02313c20ddf1399226'; 
const client = twilio(accountSid, authToken);

export function sendSMS(toNumber, messageBody) {
    
    client.messages.create({
        from: '+12177591748', 
        to: toNumber,
        body: messageBody,
    })
    .then(message => console.log(`Message sent successfully with SID: ${message.sid}`))
    .catch(error => console.error('Error sending message:', error));
}

