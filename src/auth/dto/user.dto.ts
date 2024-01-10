import {
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum UserRole {
  user = 'user',
  admin = 'admin',
}

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'The first name should not be empty' })
  first_name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The last name should not be empty' })
  last_name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The email should not be empty' })
  email: string;

  @MaxLength(15)
  @MinLength(6)
  @ApiProperty()
  @IsNotEmpty({ message: 'The password should not be empty' })
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
