import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ListAlbumsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  artistId?: string;
}
