import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { GetUser } from '@/auth/decorator/get-user.decorator';
import { User } from '@/user/entities/user.entity';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@GetUser('id') userId: number) {
    return this.cartService.getUserCart(userId);
  }

  @Post('add')
  async addToCart(
    @GetUser('id') userId: number,
    @Body() { variantId, quantity }: { variantId: number; quantity: number },
  ) {
    return this.cartService.addToCart(userId, variantId, quantity);
  }

  @Delete('remove/:variant_id')
  async removeFromCart(
    @GetUser('id') userId: number,
    @Param('variant_id', ParseIntPipe) variantId: number,
  ) {
    return this.cartService.removeFromCart(userId, variantId);
  }

  @Post('checkout')
  async checkout(@GetUser('id') userId: number) {
    return this.cartService.checkoutCart(userId);
  }

  // @Post()
  // create(@Body() createCartDto: CreateCartDto) {
  //   return this.cartService.create(createCartDto);
  // }

  // @Get()
  // findAll() {
  //   return this.cartService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.cartService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
  //   return this.cartService.update(+id, updateCartDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.cartService.remove(+id);
  // }
}
