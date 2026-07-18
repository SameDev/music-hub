import { Injectable } from '@nestjs/common';

// Stub until the schema has its first model (Auth module) — Prisma refuses to generate a client for an empty schema.
@Injectable()
export class PrismaService {}
