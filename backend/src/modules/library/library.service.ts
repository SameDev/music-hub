import { Injectable } from '@nestjs/common';
import { LibraryRepository } from './library.repository';

@Injectable()
export class LibraryService {
  constructor(private readonly libraryRepository: LibraryRepository) {}
}
