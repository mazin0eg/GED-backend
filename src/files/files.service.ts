import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';
import { MinioService } from 'src/minio/minio.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepo: Repository<FileEntity>,
    private readonly minioService: MinioService,
  ) { }

  async uploadToMinio(file: Express.Multer.File, bucketName: string, idOwner: number) {
    const fileName = `${Date.now()}-${file.originalname}`

    await this.minioService.uploadFile(bucketName, fileName, file.buffer)

    const fileEntity = this.fileRepo.create({
      keyObject: fileName,
      bucket: bucketName,
      mimeType: file.mimetype,
      idOwner: idOwner ? ({ id: idOwner } as User) : undefined,
    });


    return this.fileRepo.save(fileEntity)
  }

  async getFileUrl(file: FileEntity) {
    return this.minioService.getFileUrl(file.bucket, file.keyObject)
  }

  async deleteFile(id: number, userId: number, userRole: string): Promise<{ message: string }> {
    const file = await this.fileRepo.findOne({
      where: { id },
      relations: ['idOwner'],
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const isOwner = file.idOwner?.id === userId;
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You can only delete your own files');
    }

    await this.minioService.deleteFile(file.bucket, file.keyObject);

    await this.fileRepo.remove(file);

    return { message: 'File deleted successfully' };
  }

  async getFileById(fileId: number, userId: number) {
    const file = await this.fileRepo.findOne({
      where: { id: fileId },
      relations: ['idOwner'],
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const url = await this.minioService.getFileUrl(
      file.bucket,
      file.keyObject,
    );

    return {
      id: file.id,
      bucket: file.bucket,
      keyObject: file.keyObject,
      mimeType: file.mimeType,
      createdAt: file.createdAt,
      owner: {
        id: file.idOwner.id,
        username: file.idOwner.username,
      },
      url,
    }
  }
}
