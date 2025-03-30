import mongoose, { ObjectId, Document, Schema } from "mongoose";
import crypto from "crypto";

export interface IUser extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    password: string;
    salt: string;
    setPassword: (password: string) => void;
    validatePassword: (password: string) => boolean;
};

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
});

UserSchema.methods.setPassword = function (password: string) {
    this.salt = crypto.randomBytes(16).toString('hex');

    this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');

    return;
};

UserSchema.methods.validatePassword = function (password: string) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');

    return this.password === hash;
};

export default mongoose.model<IUser>("User", UserSchema);