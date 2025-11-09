/* archivo: src/museum-artwork/museum-artwork.module.ts */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MuseumArtworkController } from './museum-artwork.controller';
import { MuseumArtworkService } from './museum-artwork.service';
import { MuseumEntity } from '../museum/museum.entity/museum.entity';
import { ArtworkEntity } from '../artwork/artwork.entity/artwork.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MuseumEntity, ArtworkEntity]), // <-- ambos repos
  ],
  controllers: [MuseumArtworkController],
  providers: [MuseumArtworkService],
  exports: [MuseumArtworkService],
})
export class MuseumArtworkModule {}
