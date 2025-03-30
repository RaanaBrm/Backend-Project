import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';

import { connectToDatabase } from './lib/dbConnections.ts';


const userRouter = await import('./routes/users.ts');
const movieRouter = await import('./routes/movies.ts');
const authRouter = await import('./routes/auth.ts');

async function start() {

    // Load environment variables
    dotenv.config({
        path: './.env'
    });

    //Connect to database
    await connectToDatabase();

    // create new express application
    const app = express();
    app.use(cors());

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/auth', authRouter.default);
    app.use('/users', userRouter.default);
    app.use('/movies', movieRouter.default);

    app.listen(process.env.PORT, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });
}

start();