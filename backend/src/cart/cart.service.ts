import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { ProductVariant } from '@/product/entities/product-variant.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
    @InjectRepository(ProductVariant) private productVariantRepo: Repository<ProductVariant>,
  ) {}

  async getUserCart(userId: number) {
    let cart = await this.cartRepo.findOne({
      where: { user: { id: userId }, checked_out: false },
      relations: { cart_items: { variant: { product: true } } },
    });

    if (!cart) {
      cart = this.cartRepo.create({ user: { id: userId }, cart_items: [] });
      await this.cartRepo.save(cart);
    }

    return cart;
  }

  async addToCart(userId: number, productVariantId: number, quantity: number) {
    if (quantity < 1) throw new BadRequestException('Số lượng không được nhỏ hơn 1');
    const cart = await this.getUserCart(userId);

    const variant = await this.productVariantRepo.findOne({
      where: { id: productVariantId },
      relations: { product: true },
    });

    if (!variant) throw new NotFoundException('Product variant not found');
    if (variant.stock < quantity) throw new BadRequestException('Số lượng vượt quá tồn kho');

    let cartItem = cart.cart_items.find(item => item.variant.id === productVariantId);

    if (cartItem) {
      cartItem.quantity = quantity;
      await this.cartItemRepo.save(cartItem);
    } else {
      cartItem = this.cartItemRepo.create({ cart, variant, quantity });
      await this.cartItemRepo.save(cartItem);
      cart.cart_items.push(cartItem);
    }

    return cart;
  }

  async removeFromCart(userId: number, productVariantId: number) {
    const cart = await this.getUserCart(userId);
    const cartItem = cart.cart_items.find(item => item.id == productVariantId);

    if (!cartItem) throw new NotFoundException('Mục không tồn tại trong giỏ hàng');

    await this.cartItemRepo.remove(cartItem);
    cart.cart_items = cart.cart_items.filter(item => item.id !== productVariantId);
    return cart;
  }

  async checkoutCart(userId: number) {
    const cart = await this.getUserCart(userId);
    if (cart.cart_items.length === 0) {
      throw new BadRequestException('Giỏ hàng trống, không thể thanh toán');
    }
    cart.checked_out = true;
    await this.cartRepo.save(cart);
    const newCart = this.cartRepo.create({ user: { id: userId }, cart_items: [] });
    await this.cartRepo.save(newCart);
    return newCart;
  }
}
