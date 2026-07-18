import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRole, User } from '@prisma/client';
import * as argon2 from 'argon2';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const existingUserCount = await this.usersRepository.count();
    if (existingUserCount > 0) {
      return;
    }

    const email = this.config.getOrThrow<string>('ADMIN_EMAIL');
    const password = this.config.getOrThrow<string>('ADMIN_PASSWORD');
    const passwordHash = await argon2.hash(password);

    await this.usersRepository.create({ email, passwordHash, role: UserRole.ADMIN });
    this.logger.log(`Created initial admin user: ${email}`);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }
}
