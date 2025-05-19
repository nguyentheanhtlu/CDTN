import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { googleConfig } from './google.config';
import { User } from '../models/user.model';
import { Profile } from 'passport-google-oauth20';

export const configurePassport = () => {
    if (!googleConfig.clientID || !googleConfig.clientSecret || !googleConfig.callbackURL) {
        throw new Error('Google OAuth configuration is incomplete');
    }

    passport.use(new GoogleStrategy({
        clientID: googleConfig.clientID,
        clientSecret: googleConfig.clientSecret,
        callbackURL: googleConfig.callbackURL
    }, async (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) => {
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