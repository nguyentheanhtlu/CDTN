import { Product } from '../models/product.model';
import { Order } from '../models/order.model';
import { User } from '../models/user.model';

export async function enrichPromptWithData(message: string): Promise<string | null> {
  const lower = message.toLowerCase();

  // Sản phẩm đắt nhất
  if (lower.includes('sản phẩm') && lower.includes('đắt nhất')) {
    const product = await Product.findOne().sort({ price: -1 });
    if (product) {
      return `Dữ liệu sản phẩm đắt nhất: Tên: ${product.name}, Giá: ${product.price} VNĐ. Hãy trả lời cho người dùng biết sản phẩm đắt nhất là gì và giá bao nhiêu.`;
    }
  }

  // Sản phẩm rẻ nhất
  if (lower.includes('sản phẩm') && lower.includes('rẻ nhất')) {
    const product = await Product.findOne().sort({ price: 1 });
    if (product) {
      return `Dữ liệu sản phẩm rẻ nhất: Tên: ${product.name}, Giá: ${product.price} VNĐ. Hãy trả lời cho người dùng biết sản phẩm rẻ nhất là gì và giá bao nhiêu.`;
    }
  }

  // Sản phẩm nhiều lượt mua nhất
  if (lower.includes('sản phẩm') && (lower.includes('nhiều lượt mua nhất') || lower.includes('bán chạy nhất') || lower.includes('mua nhiều nhất'))) {
    const product = await Product.findOne().sort({ sold: -1 });
    if (product) {
      return `Dữ liệu sản phẩm bán chạy nhất: Tên: ${product.name}, Số lượt mua: ${product.sold}. Hãy trả lời cho người dùng biết sản phẩm bán chạy nhất là gì và đã bán được bao nhiêu lượt.`;
    }
  }


  // Tổng số đơn hàng
  if (lower.includes('tổng') && lower.includes('đơn hàng')) {
    const count = await Order.countDocuments();
    return `Tổng số đơn hàng hiện tại là: ${count}. Hãy trả lời cho người dùng biết.`;
  }

  // Tổng số user
  if (lower.includes('tổng') && (lower.includes('user') || lower.includes('người dùng') || lower.includes('khách hàng'))) {
    const count = await User.countDocuments();
    return `Tổng số người dùng hiện tại là: ${count}. Hãy trả lời cho người dùng biết.`;
  }

  // ... mở rộng cho các intent khác

  return null; // Không nhận diện được ý định đặc biệt
} 
 