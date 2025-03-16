import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { ProductVariant } from '@/product/entities/product-variant.entity';
import { Bill } from '@/bill/entities/bill.entity';
import { BehaviorService } from '@/behavior/behavior.service';
import { Product } from '@/product/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
    @InjectRepository(ProductVariant) private productVariantRepo: Repository<ProductVariant>,
    @InjectRepository(Bill) private billRepo: Repository<Bill>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    private behaviorService: BehaviorService,
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
    const cart = await this.getUserCart(userId);

    const variant = await this.productVariantRepo.findOne({
      where: { id: productVariantId },
      relations: { product: true },
    });

    if (!variant) throw new NotFoundException('Product variant not found');
    if (variant.stock < quantity) throw new BadRequestException('Số lượng vượt quá tồn kho');

    let cartItem = cart.cart_items.find(item => item.variant.id === productVariantId);

    if (cartItem) {
      cartItem.quantity += quantity;
      if (cartItem.quantity < 1) throw new BadRequestException('Số lượng không được nhỏ hơn 1');
      if (variant.stock < cartItem.quantity)
        throw new BadRequestException('Số lượng vượt quá tồn kho');
      await this.cartItemRepo.save(cartItem);
    } else {
      if (quantity < 1) throw new BadRequestException('Số lượng không được nhỏ hơn 1');
      cartItem = this.cartItemRepo.create({ cart, variant, quantity });
      await this.cartItemRepo.save(cartItem);
      cart.cart_items.push(cartItem);
    }

    await this.behaviorService.createOrUpdate(userId, variant.product.id, quantity, 'cart_adds');

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
    await this.billRepo.save({
      cart,
      total: cart.cart_items.reduce(
        (acc, cur) => acc + cur.quantity * cur.variant.product.price,
        0,
      ),
    });
    const newCart = this.cartRepo.create({ user: { id: userId }, cart_items: [] });
    await this.cartRepo.save(newCart);

    for (const cart_item of cart.cart_items) {
      await this.behaviorService.createOrUpdate(
        userId,
        cart_item.variant.product.id,
        cart_item.quantity,
        'purchases',
      );

      const variant = await this.productVariantRepo.findOneBy({ id: cart_item.variant.id });
      await this.productVariantRepo.update(cart_item.variant.id, {
        stock: variant.stock - cart_item.quantity,
      });

      this.productRepository.update(cart_item.variant.product.id, {
        buy: cart_item.variant.product.buy + 1,
      });
    }

    return newCart;
  }
}
