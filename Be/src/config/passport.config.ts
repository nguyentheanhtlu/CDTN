import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { googleConfig } from './google.config';
import { User } from '../models/user.model';

export const configurePassport = () => {
    passport.use(new GoogleStrategy({
        clientID: googleConfig.clientID,
        clientSecret: googleConfig.clientSecret,
        callbackURL: googleConfig.callbackURL
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