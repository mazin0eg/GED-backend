import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesService {

  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) { }

  async create(createRoleDto: CreateRoleDto) {
    const exist = await this.findByName(createRoleDto.name);
    if(exist){
      throw new Error(`Role ${createRoleDto.name} existe !`)
    }
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  findAll() {
    return this.roleRepository.find();
  }

  async findByName(name: string) {
    return this.roleRepository.findOne({ where: { name } });
  }

  
}
