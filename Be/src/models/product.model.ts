import mongoose, { Document, Schema } from 'mongoose';
import { ICategory } from './category.model';

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    discount: number; // Phần trăm giảm giá
    images: string[];
    category: ICategory['_id'];
    stock: number;
    sold: number;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100 // Giảm giá không thể lớn hơn 100%
    },
    images: [{
        type: String,
        required: true
    }],
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export const Product = mongoose.model<IProduct>('Product', productSchema); 