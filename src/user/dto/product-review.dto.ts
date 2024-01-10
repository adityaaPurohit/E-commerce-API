import { IsNotEmpty, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductReviewDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Product id should not be empty' })
  product: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Rating should not be empty' })
  @Max(5)
  @Min(1)
  rating: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Review should not be empty' })
  review: string;
}
