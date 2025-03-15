import mongoose, { Document, Schema, ObjectId } from "mongoose";


export interface IMovie extends Document {
    _id: ObjectId;
    originalTitle: string;
    overview: string;
    relaseDate: Date;
    voteAverage: number;
};

const MovieSchema: Schema = new Schema({
    originalTitle: { type: String, required: true },
    overview: { type: String },
    relaseDate: { type: Date },
    voteAverage: { type: Number }
});

export default mongoose.model<IMovie>("Movie", MovieSchema);