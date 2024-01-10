import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'The email should not be empty' })
  email: string;

  @MaxLength(15)
  @MinLength(6)
  @ApiProperty()
  @IsNotEmpty({ message: 'The password should not be empty' })
  password: string;
}
