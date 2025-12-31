import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
@Entity('files')
export class FileEntity {
    @PrimaryGeneratedColumn()
    id: number



    @ManyToOne(() => User, user => user.files, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'idOwner' })
    idOwner: User;

    @Column({ type: 'varchar', length: 100 , unique: true })
    keyObject: string;

    @Column({ type: 'varchar', length: 100 })
    mimeType: string;


    @Column({ type: 'varchar', length: 100 })
    bucket: string;

    @CreateDateColumn()
    createdAt: Date;


}
