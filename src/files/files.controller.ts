import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req, UnauthorizedException, ParseIntPipe } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/users/entities/user.entity';
import { Auth } from 'src/roles/decorators/roles.decorator';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post('upload')
  @Auth("user", "admin", "manager")
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request & { user: User }) {
    const userId = req.user?.id
    
    const bucketName = 'ged'

    const saveFile = await this.filesService.uploadToMinio(file, bucketName, userId)

    return saveFile
  }

  @Get(':id')
  @Auth("user", "admin", "manager")
  async getFile(@Param('id', ParseIntPipe) id: number,@Req() req: any,) {
    const userId = req.user?.id;

    return this.filesService.getFileById(id, userId);
  }




}
