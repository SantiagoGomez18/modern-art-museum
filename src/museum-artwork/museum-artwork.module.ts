/*archivo src/museum-artwork/museum-artwork.module.ts*/
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MuseumEntity } from '../museum/museum.entity/museum.entity';
import { MuseumService } from '../museum/museum.service';
import { MuseumArtworkController } from './museum-artwork.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MuseumEntity])],
  providers: [MuseumService],
  controllers: [MuseumArtworkController],
})
export class MuseumArtworkModule {}
