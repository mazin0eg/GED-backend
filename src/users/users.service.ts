import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
  ) {}

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  create(user: Partial<User>) {
    return this.userRepo.save(user);
  }

  async createUser(dto: CreateUserDto) {
    const exists = await this.findByEmail(dto.email);
    if (exists) throw new BadRequestException('Email already in use');
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      roles: [],
    });
    const saved = await this.userRepo.save(user);

    // If roleIds provided, assign roles by IDs
    if (dto.roleIds && dto.roleIds.length) {
      const roles = await this.roleRepo.findByIds(dto.roleIds);
      saved.roles = roles;
      await this.userRepo.save(saved);
    }
    return saved;
  }

  async setUserRoles(userId: number, roleIds: number[]) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const roles = await this.roleRepo.findByIds(roleIds);
    user.roles = roles;
    return this.userRepo.save(user);
  }
}

