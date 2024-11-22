import { Document, model, models, Schema } from 'mongoose';

export interface UniversalLink extends Document {
    shortCode: string;
    title: string;
    imageLink: string;
    isDeleted: boolean;
    createdBy: string;
};

const UniversalLinkSchema = new Schema<UniversalLink>({
    shortCode: {
        type: String,
        required: [true, 'shortCode is a required field'],
        unique: true,
        minlength: [5, 'shortCode must be at lease 5 character long'],
    },
    title: {
        type: String,
        required: [true, 'title is a required field']
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    imageLink: {
        type: String,
    },
    createdBy: {
        type: String,
        required: [true, 'createdBy is required field']
    }
});

export default models.UniversalLink || model<UniversalLink>('UniversalLink', UniversalLinkSchema);