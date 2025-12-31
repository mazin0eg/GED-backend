import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { MinioModule } from 'src/minio/minio.module';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), MinioModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
