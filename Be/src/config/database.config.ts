import dotenv from 'dotenv';
dotenv.config();

export const databaseConfig = {
    uri: process.env.MONGODB_URI || 'mongodb+srv://theanh:theanh3012@theanh.of7iq.mongodb.net/?retryWrites=true&w=majority&appName=CDTN',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
};