import express, { Request, Response } from 'express';
import { httpResponse } from '../lib/httpResponse.ts';

import User from '../models/User.ts';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Hello from users');
});

router.post('/', async (req: Request<{}, {}, { name: string; email: string; password: string }>, res: Response): Promise<any> => {
    try {
        const { name, email, password } = req.body;

        //Validation input data
        if (!name || !email || !password) {
            return httpResponse(400, "Bad Request", {}, res)
        }

        //Check if user exists
        const userDocument = await User.findOne({ email });

        if (userDocument) {
            return httpResponse(400, "User already exists", {}, res)
        }

        const newUser = new User({
            name,
            email
        });

        newUser.setPassword(password);

        await newUser.save();

        return httpResponse(201, "User created", { _id: newUser._id }, res)
    }
    catch (error: any) {
        console.error(error);
        return httpResponse(500, "Internal Server Error", {}, res)
    }
});


export default router;