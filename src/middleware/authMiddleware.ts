import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

// Extend the Request interface to include the 'user' property
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        res.sendStatus(401); // Unauthorized
        return;
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user;
        next();
    });
}

export default authenticateToken;