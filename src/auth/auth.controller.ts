import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import { CommonService } from 'src/common/common.service';
import { LoginUserDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly commonService: CommonService,
  ) {}

  @Post('register')
  async registerUser(
    @Body() body: CreateUserDto,
    @Res() res: any,
  ): Promise<any> {
    return await this.authService
      .registerUser(body)
      .then(async response => {
        const token = await this.commonService.toJwt(response);
        return res.status(HttpStatus.OK).json({
          status: HttpStatus.OK,
          data: response,
          tokem: token,
        });
      })
      .catch((error: any) => {
        throw new UnprocessableEntityException(error.message);
      });
  }

  @Post('login')
  async loginUser(@Body() body: LoginUserDto, @Res() res: any): Promise<any> {
    return await this.authService
      .loginUser(body)
      .then(async response => {
        const token = await this.commonService.toJwt(response);
        return res.status(HttpStatus.OK).json({
          status: HttpStatus.OK,
          data: response,
          tokem: token,
        });
      })
      .catch((error: any) => {
        throw new UnprocessableEntityException(error.message);
      });
  }
}
