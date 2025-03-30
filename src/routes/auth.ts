import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { httpResponse } from '../lib/httpResponse.ts';


import User from '../models/User.ts';

const router = express.Router();

router.post('/login', async (req: Request<{}, {}, { email: string; password: string }>, res: Response): Promise<any> => {

    const { email, password } = req.body;

    //Validation input data
    if (!email || !password) {
        return httpResponse(400, "Bad Request", {}, res)
    }

    const userDocument = await User.findOne({ email });

    if (!userDocument || !userDocument.validatePassword(password)) {
        //Check if user exists and validate password
        return httpResponse(400, "Wrong credential", {}, res)
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    const token = jwt.sign({ id: userDocument._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
        token
    });
});

export default router;