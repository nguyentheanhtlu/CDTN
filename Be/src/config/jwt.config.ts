import { Secret } from 'jsonwebtoken';

interface JWTConfig {
    secret: Secret;
    expiresIn: number;
}

export const jwtConfig: JWTConfig = {
    secret: 'your-super-secret-key',
    expiresIn: 86400 
}; 