import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
    title: string;
    content: string;
    author: mongoose.Types.ObjectId;
    thumbnail: string;
    tags: string[];
    status: 'draft' | 'published';
    createdAt: Date;
    updatedAt: Date;
}

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    thumbnail: {
        type: String,
        default: ''
    },
    tags: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    }
}, {
    timestamps: true
});

export const Blog = mongoose.model<IBlog>('Blog', blogSchema);