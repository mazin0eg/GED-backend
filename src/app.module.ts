import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioService } from './minio/minio.service';
import { FilesModule } from './files/files.module';
import { MinioModule } from './minio/minio.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        connectionFactory: (connection) => {
          console.log('MongoDB connecting');
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        synchronize: true,
        autoLoadEntities: true,

      })

    }),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      global: true,
      useFactory:(ConfigService: ConfigService)=>({
        secret:ConfigService.get<string>('JWT_SECRET'),
        signOptions:{expiresIn:'1d'}
      })
    }),
    RolesModule,
    AuthModule,
    UsersModule,
    FilesModule,
    MinioModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [JwtModule]
})
export class AppModule { }
