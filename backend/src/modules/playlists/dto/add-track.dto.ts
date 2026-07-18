import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddTrackDto {
  @ApiProperty()
  @IsString()
  trackId!: string;
}
