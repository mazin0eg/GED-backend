import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
@Entity('files')
export class FileEntity {
    @PrimaryGeneratedColumn()
    id: number


    @Column()
    idOwner: number;
    @ManyToOne(() => User, user => user.files, {
        onDelete: 'CASCADE',
    })

    @Column({ type: 'varchar', length: 100 })
    mimeType: string;


    @Column({ type: 'varchar', length: 100 })
    bucket: string;

    @CreateDateColumn()
    createdAt: Date;


}
