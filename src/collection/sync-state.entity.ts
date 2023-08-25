import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum SyncStateStatus {
    SCHEDULE = 'SCHEDULE', // 未开始
    ONGOING = 'ONGOING', // 进行中
    ERROR = 'ERROR',    // 错误
    DONE = 'DONE',  // 完成
}


@Entity('sync_state')
export class SyncState {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'collection_id',  type:"bigint" })
    collectionId: number;

    @Column({ name: 'offset_num',  type:"bigint" })
    offsetNum: number;

    @Column({ name: 'collection_symbol',  type:"varchar", length: 32, nullable: false })
    collectionSymbol: string;

    @Column({ name: 'error_message',  type: "text", default: "" })
    errorMessage: string;

    @Column({
        name: 'status',
        type: 'enum',
        enum: SyncStateStatus,
        default: SyncStateStatus.SCHEDULE,
    })
    status: SyncStateStatus;


    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp without time zone',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;
    
    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp without time zone',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;
}