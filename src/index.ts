import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import { connectToDatabase } from './lib/dbConnections.ts';


const userRouter = await import('./routes/users.ts');
const movieRouter = await import('./routes/movies.ts');

async function start() {

    // Load environment variables
    dotenv.config({
        path: './.env'
    });

    //Connect to database
    await connectToDatabase();

    // create new express application
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/users', userRouter.default);
    app.use('/movies', movieRouter.default);

    app.listen(process.env.PORT, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });
}

start();