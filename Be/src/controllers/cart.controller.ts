import { Request, Response } from 'express';
import { Cart } from '../models/cart.model';
import { Product } from '../models/product.model';

interface AuthRequest extends Request {
    user?: any;
}

// Lấy giỏ hàng của người dùng
export const getCart = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId })
            .populate('items.product', 'name price images');

        if (!cart) {
            return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy giỏ hàng', error });
    }
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        // Kiểm tra sản phẩm
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        if (!product.isAvailable || product.stock < quantity) {
            return res.status(400).json({ message: 'Sản phẩm không đủ số lượng' });
        }

        // Tìm hoặc tạo giỏ hàng
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = await Cart.create({
                user: userId,
                items: [],
                totalAmount: 0
            });
        }

        // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
        const existingItemIndex = cart.items.findIndex(
            item => item.product === productId
        );

        if (existingItemIndex > -1) {
            // Cập nhật số lượng nếu sản phẩm đã có
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Thêm sản phẩm mới vào giỏ hàng
            cart.items.push({
                product: productId,
                quantity,
                price: product.price
            });
        }

        // Tính lại tổng tiền
        cart.totalAmount = cart.items.reduce(
            (total, item) => total + (item.price * item.quantity),
            0
        );

        await cart.save();

        // Populate thông tin sản phẩm trước khi trả về
        await cart.populate('items.product', 'name price images');

        res.json({
            message: 'Thêm vào giỏ hàng thành công',
            cart
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm vào giỏ hàng', error });
    }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        // Kiểm tra số lượng tồn kho
        const product = await Product.findById(productId);
        if (!product || !product.isAvailable || product.stock < quantity) {
            return res.status(400).json({ message: 'Sản phẩm không đủ số lượng' });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
        }

        // Cập nhật số lượng
        const itemIndex = cart.items.findIndex(
            item => item.product === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
        }

        if (quantity === 0) {
            // Xóa sản phẩm khỏi giỏ hàng
            cart.items.splice(itemIndex, 1);
        } else {
            // Cập nhật số lượng
            cart.items[itemIndex].quantity = quantity;
        }

        // Tính lại tổng tiền
        cart.totalAmount = cart.items.reduce(
            (total, item) => total + (item.price * item.quantity),
            0
        );

        await cart.save();
        await cart.populate('items.product', 'name price images');

        res.json({
            message: 'Cập nhật giỏ hàng thành công',
            cart
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật giỏ hàng', error });
    }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
        }

        // Tìm index của item cần xóa
        const itemIndex = cart.items.findIndex(item => item.product == productId);
        
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
        }

        // Xóa item khỏi mảng items
        cart.items.splice(itemIndex, 1);

        // Tính lại tổng tiền
        cart.totalAmount = cart.items.reduce(
            (total, item) => total + (item.price * item.quantity),
            0
        );

        await cart.save();
        
        // Populate lại thông tin sản phẩm trước khi trả về
        await cart.populate('items.product', 'name price images');

        res.json({
            message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
            cart
        });
    } catch (error) {
        console.error('Error in removeFromCart:', error);
        res.status(500).json({ message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng', error });
    }
}; 