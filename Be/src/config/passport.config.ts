import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { googleConfig } from './google.config';
import { User } from '../models/user.model';

export const configurePassport = () => {
    passport.use(new GoogleStrategy({
        clientID: googleConfig.clientID || '746029902730-11og3rf9cg9hoor2c3vdqc1tum125tot.apps.googleusercontent.com',
        clientSecret: googleConfig.clientSecret || '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',
        callbackURL: googleConfig.callbackURL || 'http://localhost:3000/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });

            if (!user) {
                user = await User.create({
                    googleId: profile.id,
                    email: profile.emails?.[0]?.value,
                    fullName: profile.displayName,
                    isVerified: true 
                });
            }

            return done(null, user);
        } catch (error) {
            return done(error as Error, undefined);
        }
    }));
}; 