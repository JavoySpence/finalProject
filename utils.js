import twilio from 'twilio';
import crypto from 'crypto';
import schedule from 'node-schedule';

export const getRandomHexValues = (len) => {
    return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
};



