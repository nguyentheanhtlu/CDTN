import mongoose, { Document, Schema } from 'mongoose';
import { IProduct } from './product.model';
import { IUser } from './user.model';

interface OrderItem {
    product: IProduct['_id'];
    quantity: number;
    price: number;
}

interface AppliedVoucher {
    type: 'discount' | 'free_shipping';
    value: number;
    discountAmount: number;
    message?: string;
}

export interface IOrder extends Document {
    user: IUser['_id'];
    items: OrderItem[];
    totalAmount: number;
    shippingFee: number;
    discountAmount: number;
    finalAmount: number;
    shippingAddress: {
        name: string;
        phone: string;
        addressLine: string;
        ward: string;
        district: string;
        province: string;
        isNewAddress?: boolean;
    };
    paymentMethod: 'COD' | 'BANK_TRANSFER' | 'VNPay' | 'MoMo';
    paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
    orderStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    appliedVouchers: AppliedVoucher[];
    vnp_TxnRef?: string;
    momoOrderId?: string;
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
    shippingFee: {
        type: Number,
        required: true,
        default: 0
    },
    discountAmount: {
        type: Number,
        required: true,
        default: 0
    },
    finalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        addressLine: { type: String, required: true },
        ward: { type: String, required: true },
        district: { type: String, required: true },
        province: { type: String, required: true },
        isNewAddress: { type: Boolean, default: false }
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'BANK_TRANSFER', 'VNPay', 'MoMo'],
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
    },
    appliedVouchers: [{
        type: {
            type: String,
            enum: ['discount', 'free_shipping'],
            required: true
        },
        value: {
            type: Number,
            required: true
        },
        discountAmount: {
            type: Number,
            required: true
        },
        message: {
            type: String
        }
    }],
    vnp_TxnRef: {
        type: String,
        default: null
    },
    momoOrderId: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

export const Order = mongoose.model<IOrder>('Order', orderSchema); 