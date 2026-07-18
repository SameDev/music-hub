import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class ReorderTracksDto {
  @ApiProperty({ type: [String], description: 'Track IDs in the desired order' })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  trackIds!: string[];
}
