import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { collectionProviders, collectionTokenProviders, syncStateProviders } from './collection.providers';
import { CollectionService } from './collection.service';

@Module({
    imports: [DatabaseModule],
    providers: [
        ...collectionProviders, 
        ...collectionTokenProviders, 
        ...syncStateProviders, 
        CollectionService
    ],
    exports: [
        ...collectionProviders, 
        ...collectionTokenProviders, 
        ...syncStateProviders, 
        CollectionService
    ],
})
export class CollectionModule {}
