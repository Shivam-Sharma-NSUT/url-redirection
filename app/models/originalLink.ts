import { Document, model, models, Schema } from 'mongoose';

export interface OriginalLink extends Document {
    universalLink: string;
    originalLink: string;
    country: string;
    city: string;
    createdBy: string;
};

const OriginalLinkSchema = new Schema<OriginalLink>({
    universalLink: {
        type: String,
        required: [true, 'universalLink is a required field'],
        minlength: [5, 'universalLink must be at lease 5 character long'],
    },
    originalLink: {
        type: String,
        required: [true, 'originalLink is a required field'],
    },
    country: {
        type: String,
        required: [true, 'country is a required field'],
    },
    city: {
        type: String,
    },
    createdBy: {
        type: String,
        required: [true, 'createdBy is required field']
    }
});

OriginalLinkSchema.index({ universalLink: 1, country: 1 }, { unique: true });

export default models.OriginalLink || model<OriginalLink>('OriginalLink', OriginalLinkSchema);