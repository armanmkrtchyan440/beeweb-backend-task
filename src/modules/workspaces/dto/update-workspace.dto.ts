import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateWorkspaceDto {
  @ApiPropertyOptional({
    example: 'Updated Workspace Name',
    description: 'The new name of the workspace',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'updated-slug',
    description: 'The new slug of the workspace',
  })
  @IsOptional()
  @IsString()
  slug?: string;
}
