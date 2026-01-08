import { FileEntity } from 'src/files/entities/file.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Opportunity } from './opportunity.entity';

@Entity('opportunity_applications')
@Unique(['applicant', 'opportunity'])
export class OpportunityApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Opportunity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'opportunityId' })
  opportunity: Opportunity;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'applicantId' })
  applicant: User;

  @ManyToOne(() => FileEntity, { nullable: true, eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'cvFileId' })
  cvFile?: FileEntity | null;

  @Column({ type: 'text', nullable: true })
  coverLetter?: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
