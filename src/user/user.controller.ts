import {
  Controller,
  UseGuards,
  Query,
  Put,
  Res,
  Request,
  HttpStatus,
  UnprocessableEntityException,
  Get,
  Post,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ProductReviewDto } from './dto/product-review.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Put('add-to-cart')
  async addProductInCart(
    @Query() query: any,
    @Res() res: any,
    @Request() request: any,
  ): Promise<any> {
    return await this.userService
      .addProductInCart(query, request.user._id)
      .then(async response => {
        return res.status(HttpStatus.OK).json({
          status: HttpStatus.OK,
          data: response,
        });
      })
      .catch((error: any) => {
        throw new UnprocessableEntityException(error.message);
      });
  }

  @UseGuards(JwtGuard)
  @Put('place-order')
  async placeOrder(
    @Query() query: any,
    @Res() res: any,
    @Request() request: any,
  ): Promise<any> {
    return await this.userService
      .placeOrder(query, request.user._id)
      .then(async response => {
        return res.status(HttpStatus.OK).json({
          status: HttpStatus.OK,
          data: response,
        });
      })
      .catch((error: any) => {
        throw new UnprocessableEntityException(error.message);
      });
  }

  @UseGuards(JwtGuard)
  @Get('order-history')
  async orderHistory(@Res() res: any, @Request() request: any): Promise<any> {
    return await this.userService
      .getOrderHistory(request.user._id)
      .then(async response => {
        return res.status(HttpStatus.OK).json({
          status: HttpStatus.OK,
          data: response,
        });
      })
      .catch((error: any) => {
        throw new UnprocessableEntityException(error.message);
      });
  }

  @UseGuards(JwtGuard)
  @Post('give-review-product')
  async giveReviewProduct(
    @Res() res: any,
    @Body() body: ProductReviewDto,
    @Request() request: any,
  ): Promise<any> {
    return await this.userService
      .giveReviewProduct(request.user, body)
      .then(async response => {
        return res.status(HttpStatus.OK).json({
          status: HttpStatus.OK,
          data: response,
        });
      })
      .catch((error: any) => {
        throw new UnprocessableEntityException(error.message);
      });
  }

  @UseGuards(JwtGuard)
  @Get('products')
  async products(@Res() res: any, @Request() request: any): Promise<any> {
    return await this.userService
      .getProducts(request.user)
      .then(async response => {
        return res.status(HttpStatus.OK).json({
          status: HttpStatus.OK,
          data: response,
        });
      })
      .catch((error: any) => {
        throw new UnprocessableEntityException(error.message);
      });
  }
}
