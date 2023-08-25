import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Collection } from './collection.entity';
import { CollectionToken } from './collection-token.entity';
import { SyncState } from './sync-state.entity';

@Injectable()
export class CollectionService {
    constructor(
        @Inject('COLLECTION_REPOSITORY')
        private collectionRepository: Repository<Collection>,
        @Inject('COLLECTION_TOKEN_REPOSITORY')
        private collectionTokenRepository: Repository<CollectionToken>,
        @Inject('SYNC_STATE_REPOSITORY')
        private syncStateRepository: Repository<SyncState>,
    ) {}

    // 根据collection symbol获取collection
    async findCollectionBySymbol(symbol: string): Promise<Collection> {
        return await this.collectionRepository.findOne({
            where: { collectionSymbol: symbol },
        })
    }

    // 根据collectionId获取同步状态
    async findSyncStateByCollectionId(collectionId: number): Promise<SyncState> {
        return await this.syncStateRepository.findOne({
            where: { collectionId },
        })
    }

    async findSyncStateByCollectionSymbol(collectionSymbol: string): Promise<SyncState> {
        return await this.syncStateRepository.findOne({
            where: { collectionSymbol },
        })
    }

    async findCollectionTokenByInscriptionId(inscriptionId: string): Promise<CollectionToken> {
        return await this.collectionTokenRepository.findOne({
            where: { inscriptionId },
        })
    }

    // 根据collectionId查询所有token
    async findTokenCountByCollectionId(collectionId: number): Promise<number> {
        return await this.collectionTokenRepository.count({
            where: { collectionId },
        })
    }

    async updateCollectionToken(id: number, collectionToken: CollectionToken): Promise<void> {
        await this.collectionTokenRepository.update(id, collectionToken);
    }

    async saveCollection(collection: Collection): Promise<Collection> {
        return await this.collectionRepository.save(collection);
    }

    async saveCollectionToken(collectionToken: CollectionToken): Promise<CollectionToken> {
        return await this.collectionTokenRepository.save(collectionToken);
    }

    async saveSyncState(syncState: SyncState): Promise<SyncState> {
        return await this.syncStateRepository.save(syncState);
    }
    async updateSyncState(id: number, syncState: SyncState): Promise<void> {
        await this.syncStateRepository.update(id, syncState);
    }
}