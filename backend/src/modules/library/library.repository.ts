import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LibraryRepository {
  constructor(private readonly prisma: PrismaService) {}
}
