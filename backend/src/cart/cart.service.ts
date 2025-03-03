import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
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
      relations: { cart_items: { variant: true } },
    });

    if (!cart) {
      cart = this.cartRepo.create({ user: { id: userId }, cart_items: [] });
      await this.cartRepo.save(cart);
    }

    return cart;
  }

  async addToCart(userId: number, productVariantId: number, quantity: number) {
    const cart = await this.getUserCart(userId);
    const variant = await this.productVariantRepo.findOne({ where: { id: productVariantId } });

    if (!variant) throw new NotFoundException('Product variant not found');

    let cartItem = cart.cart_items.find(item => item.variant.id === productVariantId);

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = this.cartItemRepo.create({ cart, variant, quantity });
      cart.cart_items.push(cartItem);
    }

    await this.cartRepo.save(cart);
    return cart;
  }

  async removeFromCart(userId: number, productVariantId: number) {
    const cart = await this.getUserCart(userId);
    cart.cart_items = cart.cart_items.filter(item => item.variant.id !== productVariantId);
    await this.cartRepo.save(cart);
    return cart;
  }

  async checkoutCart(userId: number) {
    const cart = await this.getUserCart(userId);
    cart.checked_out = true;
    await this.cartRepo.save(cart);
    return cart;
  }

  create(createCartDto: CreateCartDto) {
    return 'This action adds a new cart';
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
