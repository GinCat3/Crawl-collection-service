import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';


@Entity('collection_token')
export class CollectionToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'collection_id',  type:"bigint" })
    collectionId: number;

    @Column({ type:"varchar", length: 128 })
    name: string;

    @Column({ name: 'inscription_id', type:"varchar", length: 128 })
    inscriptionId: string;

    @Column({ name: 'me_inscription_number', type:"bigint"})
    meInscriptionNumber: number;

    @Column({ name: 'genesis_transaction_hash', type:"varchar", length: 128})
    genesisTransactionHash: string;

    @Column({ name: 'genesis_block_hash', type:"varchar", length: 128})
    genesisBlockHash: string;

    @Column({ name: 'genesis_block_time', type:"timestamp without time zone" })
    genesisBlockTime: Date;

    @Column({ name: 'genesis_block_height', type:"bigint"})
    genesisBlockHeight: number;

    @Column({ name: 'owner', type:"varchar", length: 128 })
    owner: string;

    @Column({ name: 'sat', type:"bigint"})
    sat: number;

    @Column({ name: 'sat_rarity', type:"varchar", length: 32 })
    satRarity: string;

    @Column({ name: 'sat_block_height', type:"bigint"})
    satBlockHeight: number;

    @Column({ name: 'sat_block_time', type:"timestamp without time zone" })
    satBlockTime: Date;

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