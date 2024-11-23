import { Document, model, models, Schema } from 'mongoose';

export interface User extends Document {
    username: string;
    email: string;
    password: string;
};

const UserSchema = new Schema<User>({
    username: {
        type: String,
        required: [true, 'username is a required field'],
        minlength: [1, 'username must not be empty string'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email is a required field'],
    },
    password: {
        type: String,
        required: [true, 'password is a required field'],
    },
});

export default models.User || model<User>('User', UserSchema);