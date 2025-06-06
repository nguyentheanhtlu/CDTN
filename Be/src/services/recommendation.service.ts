import { Product } from '../models/product.model';
import { Order } from '../models/order.model';

interface ProductScore {
  productId: string;
  score: number;
}

export class RecommendationService {
  // Tính toán ma trận tương tác giữa người dùng và sản phẩm
  private calculateUserProductMatrix(orders: any): Map<string, Map<string, number>> {
    const userProductMatrix = new Map<string, Map<string, number>>();

    orders.forEach((order: any) => {
      const userId = order.user.toString();
      if (!userProductMatrix.has(userId)) {
        userProductMatrix.set(userId, new Map<string, number>());
      }

      order.items.forEach((item: any) => {
        const productId = item.product.toString();
        const currentScore = userProductMatrix.get(userId)?.get(productId) || 0;
        userProductMatrix.get(userId)?.set(productId, currentScore + item.quantity);
      });
    });

    return userProductMatrix;
  }

  // Tính toán độ tương đồng giữa các sản phẩm
  private calculateProductSimilarity(
    userProductMatrix: Map<string, Map<string, number>>,
    products: any[]
  ): Map<string, Map<string, number>> {
    const productSimilarity = new Map<string, Map<string, number>>();
    const productUsers = new Map<string, Set<string>>();

    // Tạo map người dùng cho mỗi sản phẩm
    userProductMatrix.forEach((productScores, userId) => {
      productScores.forEach((score, productId) => {
        if (!productUsers.has(productId)) {
          productUsers.set(productId, new Set<string>());
        }
        productUsers.get(productId)?.add(userId);
      });
    });

    // Tính toán độ tương đồng giữa các sản phẩm
    products.forEach(product1 => {
      const product1Id = product1._id.toString();
      productSimilarity.set(product1Id, new Map<string, number>());

      products.forEach(product2 => {
        const product2Id = product2._id.toString();
        if (product1Id === product2Id) return;

        const users1 = productUsers.get(product1Id) || new Set<string>();
        const users2 = productUsers.get(product2Id) || new Set<string>();

        // Tính Jaccard similarity
        const intersection = new Set([...users1].filter(x => users2.has(x)));
        const union = new Set([...users1, ...users2]);
        const similarity = intersection.size / union.size;

        productSimilarity.get(product1Id)?.set(product2Id, similarity);
      });
    });

    return productSimilarity;
  }

  // Lấy danh sách sản phẩm gợi ý cho một người dùng
  public async getRecommendedProducts(
    userId: string,
    orders: any[],
    products: any[],
    limit: number = 5
  ): Promise<any[]> {
    const userProductMatrix = this.calculateUserProductMatrix(orders);
    const productSimilarity = this.calculateProductSimilarity(userProductMatrix, products);

    // Lấy lịch sử mua hàng của người dùng
    const userHistory = userProductMatrix.get(userId) || new Map<string, number>();
    const productScores: ProductScore[] = [];

    // Tính điểm cho mỗi sản phẩm
    products.forEach(product => {
      const productId = product._id.toString();
      if (userHistory.has(productId)) return; // Bỏ qua sản phẩm đã mua

      let score = 0;
      userHistory.forEach((quantity, purchasedProductId) => {
        const similarity = productSimilarity.get(purchasedProductId)?.get(productId) || 0;
        score += similarity * quantity;
      });

      productScores.push({ productId, score });
    });

    // Sắp xếp sản phẩm theo điểm số
    productScores.sort((a, b) => b.score - a.score);

    // Lấy top N sản phẩm có điểm cao nhất
    const recommendedProductIds = productScores
      .slice(0, limit)
      .map(score => score.productId);

    // Lấy thông tin chi tiết của các sản phẩm được gợi ý
    return products.filter(product => 
      recommendedProductIds.includes(product._id.toString())
    );
  }

  // Lấy danh sách sản phẩm tương tự
  public async getSimilarProducts(
    productId: string,
    products: any[],
    limit: number = 5
  ): Promise<any[]> {
    const orders = await Order.find().populate('items.product');
    const productSimilarity = this.calculateProductSimilarity(
      this.calculateUserProductMatrix(orders),
      products
    );

    const similarities = Array.from(productSimilarity.get(productId)?.entries() || [])
      .map(([id, score]) => ({ id, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return products.filter(product => 
      similarities.some(sim => sim.id === product._id.toString())
    );
  }
} 