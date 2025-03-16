import mongoose, { Document, Schema, ObjectId } from "mongoose";


export interface IMovie extends Document {
    _id: ObjectId;
    movie_id: number;
    original_title: string;
    overview: string;
    release_date: Date;
    vote_average: number;
    poster_path: string;
    backdrop_path: string;
    original_language: string;
    adult: boolean;

};

const MovieSchema: Schema = new Schema({
    movie_id: { type: Number },
    original_title: { type: String, required: true },
    overview: { type: String },
    release_date: { type: Date },
    vote_average: { type: Number },
    poster_path: { type: String },
    backdrop_path: { type: String },
    original_language: { type: String },
    adult: { type: Boolean }

});

export default mongoose.model<IMovie>("Movie", MovieSchema);