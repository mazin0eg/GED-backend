import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
 imports:[
  ConfigModule,
  MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
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
