import dotenv from 'dotenv';
dotenv.config();


export const googleConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID || '746029902730-11og3rf9cg9hoor2c3vdqc1tum125tot.apps.googleusercontent.com',
    clientSecret:  process.env.GOOGLE_CLIENT_SECRET || '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',
    callbackURL:   process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback'
}; 