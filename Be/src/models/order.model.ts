import mongoose, { Document, Schema } from 'mongoose';
import { IProduct } from './product.model';
import { IUser } from './user.model';

interface OrderItem {
    product: IProduct['_id'];
    quantity: number;
    price: number;
}

export interface IOrder extends Document {
    user: IUser['_id'];
    items: OrderItem[];
    totalAmount: number;
    shippingAddress: {
        address: string;
        city: string;
        phone: string;
    };
    paymentMethod: 'COD' | 'BANK_TRANSFER';
    paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
    orderStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    createdAt: Date;
    updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
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
        required: true
    },
    shippingAddress: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        }
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'BANK_TRANSFER'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'PAID', 'FAILED'],
        default: 'PENDING'
    },
    orderStatus: {
        type: String,
        enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
        default: 'PENDING'
    }
}, {
    timestamps: true
});

export const Order = mongoose.model<IOrder>('Order', orderSchema); 