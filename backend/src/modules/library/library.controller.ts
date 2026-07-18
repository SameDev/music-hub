import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LibraryService } from './library.service';

@ApiTags('library')
@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}
}
