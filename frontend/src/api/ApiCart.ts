import { fetcher } from './Fetcher';

export interface CartItem {
  id: number;
  variant: {
    id: number;
    product: { name: string; price: number };
    type: string;
    image?: string;
  };
  quantity: number;
}

export interface Cart {
  id: number;
  checked_out: boolean;
  cart_items: CartItem[];
}

// Lấy giỏ hàng hiện tại
function get(): Promise<Cart> {
  return fetcher({ url: '/cart', method: 'get' });
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(data: { variantId: number; quantity: number }): Promise<Cart> {
  return fetcher({ url: '/cart/add', method: 'post', data });
}

// Xóa mục khỏi giỏ hàng
function removeFromCart(cartItemId: number): Promise<Cart> {
  return fetcher({ url: `/cart/remove/${cartItemId}`, method: 'delete' });
}

// Thanh toán giỏ hàng
function checkout(): Promise<{ message: string }> {
  return fetcher({ url: '/cart/checkout', method: 'post' });
}

export default {
  get,
  addToCart,
  removeFromCart,
  checkout,
};
