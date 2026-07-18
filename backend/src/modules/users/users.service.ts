import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, UserRole, User } from '@prisma/client';
import * as argon2 from 'argon2';
import { UsersRepository } from './users.repository';
import { UpdateMeDto } from './dto/update-me.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { SafeUser, toSafeUser } from './entities/safe-user.entity';

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

  async getProfile(id: string): Promise<SafeUser> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return toSafeUser(user);
  }

  async updateProfile(id: string, dto: UpdateMeDto): Promise<SafeUser> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const data: { email?: string; passwordHash?: string } = {};

    if (dto.email) {
      data.email = dto.email;
    }

    if (dto.newPassword) {
      if (!dto.currentPassword) {
        throw new BadRequestException('currentPassword is required to set a new password');
      }
      if (!(await argon2.verify(user.passwordHash, dto.currentPassword))) {
        throw new UnauthorizedException('Current password is incorrect');
      }
      data.passwordHash = await argon2.hash(dto.newPassword);
    }

    try {
      const updated = await this.usersRepository.update(id, data);
      return toSafeUser(updated);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email already in use');
      }
      throw error;
    }
  }

  async listUsers(): Promise<SafeUser[]> {
    const users = await this.usersRepository.findAll();
    return users.map(toSafeUser);
  }

  async createUser(dto: CreateUserDto): Promise<SafeUser> {
    const passwordHash = await argon2.hash(dto.password);
    try {
      const created = await this.usersRepository.create({
        email: dto.email,
        passwordHash,
        role: dto.role ?? UserRole.USER,
      });
      return toSafeUser(created);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email already in use');
      }
      throw error;
    }
  }

  async deleteUser(requestingUserId: string, targetId: string): Promise<void> {
    if (requestingUserId === targetId) {
      throw new BadRequestException('Cannot delete your own account');
    }

    const target = await this.usersRepository.findById(targetId);
    if (!target) {
      throw new NotFoundException('User not found');
    }

    if (target.role === UserRole.ADMIN) {
      const adminCount = await this.usersRepository.countByRole(UserRole.ADMIN);
      if (adminCount <= 1) {
        throw new ForbiddenException('Cannot delete the last remaining admin');
      }
    }

    await this.usersRepository.delete(targetId);
  }
}
