import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckSlugDto {
  @ApiProperty({
    example: 'my-workspace',
    description: 'Unique slug for the workspace',
  })
  @IsNotEmpty()
  @IsString()
  slug: string;
}
