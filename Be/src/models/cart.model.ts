import mongoose, { Document, Schema } from 'mongoose';
import { IProduct } from './product.model';
import { IUser } from './user.model';

interface CartItem {
    product: IProduct['_id'];
    quantity: number;
    price: number;
}

export interface ICart extends Document {
    user: IUser['_id'];
    items: CartItem[];
    totalAmount: number;
    updatedAt: Date;
}

const cartSchema = new Schema<ICart>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

export const Cart = mongoose.model<ICart>('Cart', cartSchema); 