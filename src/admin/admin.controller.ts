import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UnprocessableEntityException,
  UseGuards,
  Get,
  Query,
  Delete,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateProductDto } from './dto/product.dto';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtGuard)
  @Post('add-edit-product')
  async createProduct(
    @Body() body: CreateProductDto,
    @Query() query: any,
    @Res() res: any,
  ): Promise<any> {
    return await this.adminService
      .createProduct(body, query)
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
  async productList(@Query() query: any, @Res() res: any): Promise<any> {
    return await this.adminService
      .productList(query)
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
  @Delete('product')
  async RemoveProduct(@Query() query: any, @Res() res: any): Promise<any> {
    return await this.adminService
      .deleteProduct(query)
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
