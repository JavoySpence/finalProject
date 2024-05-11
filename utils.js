import twilio from 'twilio';
import crypto from 'crypto';
import schedule from 'node-schedule';


export const getRandomHexValues = (len) => {
    return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
};




export function sendSMS(toNumber, messageBody) {
    
    client.messages.create({
        from: '+12177591748', 
        to: toNumber,
        body: messageBody,
    })
    .then(message => console.log(`Message sent successfully with SID: ${message.sid}`))
    .catch(error => console.error('Error sending message:', error));
}

