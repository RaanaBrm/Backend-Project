import mongoose from "mongoose";

export const connectToDatabase = async () => {
    const db = (await mongoose.connect(process.env.MONGO_URI as string)).connection;

    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', () => {
        console.log("Connected to database");
    });

    return db;
};