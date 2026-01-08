import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Opportunity } from './entities/opportunity.entity';
import { OpportunitiesService } from './opportunities.service';
import { OpportunitiesController } from './opportunities.controller';
import { User } from 'src/users/entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Application, ApplicationSchema } from './schemas/application.schema';
import { MinioModule } from 'src/minio/minio.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Opportunity, User]),
    MongooseModule.forFeature([{ name: Application.name, schema: ApplicationSchema }]),
    MinioModule,
    ConfigModule,
  ],
  providers: [OpportunitiesService],
  controllers: [OpportunitiesController],
})
export class OpportunitiesModule {}
