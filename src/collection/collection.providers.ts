import { DataSource } from 'typeorm';
import { Collection } from './collection.entity';
import { SyncState } from './sync-state.entity';
import { CollectionToken } from './collection-token.entity';

export const collectionProviders = [
    {
        provide: 'COLLECTION_REPOSITORY',
        useFactory: (dataSource: DataSource) =>
            dataSource.getRepository(Collection),
        inject: ['DATA_SOURCE'],
    },
];

export const collectionTokenProviders = [
    {
        provide: 'COLLECTION_TOKEN_REPOSITORY',
        useFactory: (dataSource: DataSource) =>
            dataSource.getRepository(CollectionToken),
        inject: ['DATA_SOURCE'],
    },
];

export const syncStateProviders = [
    {
        provide: 'SYNC_STATE_REPOSITORY',
        useFactory: (dataSource: DataSource) =>
            dataSource.getRepository(SyncState),
        inject: ['DATA_SOURCE'],
    },
];


