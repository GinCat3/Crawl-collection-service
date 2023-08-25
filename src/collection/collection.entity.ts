import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('collection')
@Index(['collectionSymbol'], { unique: true })
export class Collection {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'collection_symbol', type:"varchar", length: 32 })
    collectionSymbol: string;

    @Column({ name: 'collection_name', type:"varchar", length: 64 })
    collectionName: string;

    @Column({ name: 'collection_desc', type:"text", default: "" })
    collectionDesc: string;

    @Column({ name: 'total_supply', type:"bigint", default: 0 })
    totalSupply: number;

    @Column({ name: 'range_start', type:"bigint", default: 0 })
    rangeStart: number;

    @Column({ name: 'range_end', type:"bigint", default: 0 })
    rangeEnd: number;

    @Column({ name: 'cover_img', type:"text", default: "" })
    coverImg: string;

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