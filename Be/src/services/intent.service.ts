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
  if (lower.includes('sản phẩm') && (lower.includes('nhiều lượt mua nhất') || lower.includes('bán chạy nhất') || lower.includes('mua nhiều nhất') || lower.includes('bán nhiều nhất') || lower.includes('yêu thích nhiều nhất'))) {
    const product = await Product.findOne().sort({ sold: -1 });
    if (product) {
      return `Dữ liệu sản phẩm bán chạy nhất: Tên: ${product.name}, Số lượt mua: ${product.sold}. Hãy trả lời cho người dùng biết sản phẩm bán chạy nhất là gì và đã bán được bao nhiêu lượt.`;
    }
  }

  // Sản phẩm có đánh giá tốt nhất
  if (lower.includes('sản phẩm') && (lower.includes('đánh giá tốt nhất') || lower.includes('cao nhất') || lower.includes('nhiều sao nhất'))) {
    const product = await Product.findOne().sort({ averageRating: -1 });
    if (product) {
      return `Dữ liệu sản phẩm có đánh giá tốt nhất: Tên: ${product.name}, Đánh giá trung bình: ${product.averageRating} sao, Số lượt đánh giá: ${product.reviewCount}. Hãy trả lời cho người dùng biết sản phẩm có đánh giá tốt nhất là gì và có bao nhiêu sao.`;
    }
  }

  // Sản phẩm có đánh giá kém nhất
  if (lower.includes('sản phẩm') && (lower.includes('đánh giá thấp nhất') || lower.includes('rating thấp nhất') || lower.includes('sao thấp nhất'))) {
    const product = await Product.findOne().sort({ averageRating: 1 });
    if (product) {
      return `Dữ liệu sản phẩm có đánh giá kém nhất: Tên: ${product.name}, Đánh giá trung bình: ${product.averageRating} sao, Số lượt đánh giá: ${product.reviewCount}. Hãy trả lời cho người dùng biết sản phẩm có đánh giá kém nhất là gì và có bao nhiêu sao.`;
    }
  }

  // Sản phẩm có nhiều đánh giá nhất
  if (lower.includes('sản phẩm') && (lower.includes('nhiều đánh giá nhất') || lower.includes('nhiều review nhất'))) {
    const product = await Product.findOne().sort({ reviewCount: -1 });
    if (product) {
      return `Dữ liệu sản phẩm có nhiều đánh giá nhất: Tên: ${product.name}, Số lượt đánh giá: ${product.reviewCount}, Đánh giá trung bình: ${product.averageRating} sao. Hãy trả lời cho người dùng biết sản phẩm có nhiều đánh giá nhất là gì và có bao nhiêu lượt đánh giá.`;
    }
  }

  // Tổng số đơn hàng
  if (lower.includes('tổng') && lower.includes('đơn hàng')) {
    const count = await Order.countDocuments();
    return `Tổng số đơn hàng hiện tại là: ${count}. Hãy trả lời cho người dùng biết.`;
  }

  // Gợi ý sản phẩm theo từ khóa
  const productKeywords = {
    'quần áo': ['áo', 'quần', 'váy', 'đầm', 'áo thun', 'áo sơ mi', 'quần jean'],
    'giày dép': ['giày', 'dép', 'sandal', 'boots', 'sneaker'],
    'túi xách': ['túi', 'balo', 'cặp', 'ví'],
    'phụ kiện': ['vòng', 'lắc', 'dây chuyền', 'nhẫn', 'kính', 'mũ'],
    'mỹ phẩm': ['son', 'kem', 'sữa rửa mặt', 'toner', 'serum'],
    'đồ điện tử': ['điện thoại', 'laptop', 'tablet', 'máy tính', 'phụ kiện điện tử']
  };

  for (const [category, keywords] of Object.entries(productKeywords)) {
    if (lower.includes(category) || keywords.some(keyword => lower.includes(keyword))) {
      const products = await Product.find({
        $or: [
          { name: { $regex: category, $options: 'i' } },
          { name: { $regex: keywords.join('|'), $options: 'i' } }
        ]
      }).limit(5);

      if (products.length > 0) {
        const productList = products.map(p => 
          `- ${p.name}: ${p.price.toLocaleString('vi-VN')} VNĐ`
        ).join('\n');
        
        return `Tôi tìm thấy một số sản phẩm ${category} phù hợp với bạn:\n${productList}\n\nHãy trả lời cho người dùng biết về các sản phẩm này và gợi ý họ có thể xem thêm tại trang shop.`;
      }
    }
  }

  // ... mở rộng cho các intent khác

  return null; // Không nhận diện được ý định đặc biệt
} 
 