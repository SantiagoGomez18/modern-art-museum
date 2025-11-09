import { Module } from '@nestjs/common';
import { MuseumService } from './museum.service';
import { MuseumEntity } from './museum.entity/museum.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MuseumController } from './museum.controller';

@Module({
  providers: [MuseumService],
  imports: [TypeOrmModule.forFeature([MuseumEntity])],
  controllers: [MuseumController],
})
export class MuseumModule {}
