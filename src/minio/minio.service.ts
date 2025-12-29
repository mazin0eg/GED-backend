import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import strict from 'assert/strict';
import * as Minio from "minio"

@Injectable()
export class MinioService implements OnModuleInit {
    private minioClient: Minio.Client;
    constructor(private configService: ConfigService) { }
    onModuleInit() {
        this.minioClient = new Minio.Client({
            endPoint: this.configService.get<string>('S3_ENDPOINT', 'localhost'),
            port: this.configService.get<number>('S3_PORT'),
            useSSL: this.configService.get<string>('S3_USE_SSL') === 'true',
            accessKey: this.configService.get<string>('S3_ACCESS_KEY'),
            secretKey: this.configService.get<string>('S3_SECRET_KEY'),
        })
    }

    private async ensureBucket(bucketName: string): Promise<void> {
        try {
            const existbucket = await this.minioClient.bucketExists(bucketName)
            if (!existbucket) {
                await this.minioClient.makeBucket(bucketName, 'us-east-1')
                console.log(`Bucket "${bucketName}" created`)
            }
        } catch (error) {
            console.error(`${error.message}`)
            throw new InternalServerErrorException("could not verify or creat bucker ")
        }
    }
    async uploadFile(bucketName: string, fileName: string, fileBuffer: Buffer) {
        await this.ensureBucket(bucketName)

        return await this.minioClient.putObject(bucketName, fileName, fileBuffer)

    }

    async getFileUrl(bucketName: string, fileName: string) {
        return await this.minioClient.presignedUrl('GET', bucketName, fileName, 24 * 60 * 60)
    }

    async deleteFile(bucketName: string, fileName: string) {
        try {
            const bucketExists = await this.minioClient.bucketExists(bucketName);
            if (!bucketExists) {
                throw new Error(`Bucket ${bucketName} does not exist`);
            }

            await this.minioClient.removeObject(bucketName, fileName);
            return { deleted: true, fileName };
        } catch (error) {
            console.error(`Error deleting file: ${error.message}`);
            throw new InternalServerErrorException('Failed to delete file from storage');
        }
    }
}
