import { Router } from 'express';
import passport from 'passport';
import * as googleAuthController from '../controllers/google-auth.controller';

const router = Router();


router.get('/login', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/callback', 
    passport.authenticate('google', { session: false }),
    googleAuthController.googleCallback
);

export default router; 