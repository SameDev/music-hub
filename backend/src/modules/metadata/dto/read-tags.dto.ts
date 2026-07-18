import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReadTagsDto {
  @ApiProperty({ description: 'Path to the audio file, must be inside LIBRARY_PATH' })
  @IsString()
  filePath!: string;
}
