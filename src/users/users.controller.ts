import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { Auth } from 'src/roles/decorators/roles.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IsArray, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class SetRolesDto {
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  roleIds: number[];
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Auth('admin')
  async createUser(@Body() dto: CreateUserDto) {
    const user = await this.usersService.createUser(dto);
    return { id: user.id, email: user.email, roles: user.roles?.map(r => r.name) };
  }

  @Put(':id/roles')
  @Auth('admin')
  async setRoles(@Param('id') id: number, @Body() body: SetRolesDto) {
    const user = await this.usersService.setUserRoles(id, body.roleIds);
    return { id: user.id, email: user.email, roles: user.roles?.map(r => r.name) };
  }
}
