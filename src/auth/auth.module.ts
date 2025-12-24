import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';


@Module({
 imports:[
  ConfigModule,
   TypeOrmModule.forFeature([User]),
  JwtModule.registerAsync({
    imports:[ConfigModule],
    inject:[ConfigService],
    useFactory:(ConfigService: ConfigService)=>({
      secret:ConfigService.get<string>('JWT_SECRET'),
      signOptions:{expiresIn:'1d'}
    })
  })
 ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
