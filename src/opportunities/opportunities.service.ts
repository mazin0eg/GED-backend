import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Opportunity } from './entities/opportunity.entity';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Application, ApplicationDocument } from './schemas/application.schema';
import { Model } from 'mongoose';
import { MinioService } from 'src/minio/minio.service';
import { ConfigService } from '@nestjs/config';
import { ApplyFormDto } from './dto/apply-form.dto';

@Injectable()
export class OpportunitiesService {
  constructor(
    @InjectRepository(Opportunity)
    private readonly oppRepo: Repository<Opportunity>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectModel(Application.name)
    private readonly appModel: Model<ApplicationDocument>,
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateOpportunityDto, creatorId: number) {
    const creator = await this.userRepo.findOne({ where: { id: creatorId } });
    const opportunity = this.oppRepo.create({
      title: dto.title,
      description: dto.description,
      location: dto.location,
      deadline: dto.deadline ? new Date(dto.deadline) : undefined,
      isActive: dto.isActive ?? true,
      createdBy: creator ?? null,
    });
    return this.oppRepo.save(opportunity);
  }

  async findAll(activeOnly = true) {
    return this.oppRepo.find({
      where: activeOnly ? { isActive: true } : {},
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const opp = await this.oppRepo.findOne({ where: { id } });
    if (!opp) throw new NotFoundException('Opportunity not found');
    return opp;
  }

  async applyWithForm(
    opportunityId: number,
    applicantId: number,
    dto: ApplyFormDto,
    file?: Express.Multer.File,
  ) {
    const opp = await this.oppRepo.findOne({ where: { id: opportunityId, isActive: true } });
    if (!opp) throw new NotFoundException('Opportunity not found or inactive');

    const applicant = await this.userRepo.findOne({ where: { id: applicantId } });
    if (!applicant) throw new NotFoundException('Applicant not found');

    const existing = await this.appModel.findOne({ opportunityId, applicantId }).lean();
    if (existing) throw new ConflictException('Already applied to this opportunity');

    let cvMeta: { bucket: string; key: string; mimeType?: string; size?: number } | undefined;
    if (file) {
      const bucket = this.configService.get<string>('CV_BUCKET') || 'cvs';
      const key = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.originalname}`;
      await this.minioService.uploadFile(bucket, key, file.buffer);
      cvMeta = { bucket, key, mimeType: file.mimetype, size: file.size };
    }

    const created = await this.appModel.create({
      opportunityId,
      applicantId,
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      coverLetter: dto.coverLetter,
      cv: cvMeta,
      status: 'submitted',
    });

    return created;
  }

  async listApplications(opportunityId: number) {
    const opp = await this.oppRepo.findOne({ where: { id: opportunityId } });
    if (!opp) throw new NotFoundException('Opportunity not found');
    return this.appModel
      .find({ opportunityId })
      .sort({ createdAt: -1 })
      .lean();
  }
}
