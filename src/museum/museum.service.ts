import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MuseumEntity } from './museum.entity/museum.entity';
import { BusinessError } from '../shared/errors/business-errors';
import { BusinessLogicException } from '../shared/errors/business-errors';

type filtros = {
  city?: string;
  name?: string;
  foundedBefore?: string;
  page?: string;
  limit?: string;
};

@Injectable()
export class MuseumService {
  constructor(
    @InjectRepository(MuseumEntity)
    private readonly museumRepository: Repository<MuseumEntity>,
  ) {}

  async findAll(filters?: filtros): Promise<MuseumEntity[]> {
    const city = filters?.city;
    const name = filters?.name;
    const foundedBefore =
      filters?.foundedBefore && !Number.isNaN(Number(filters.foundedBefore))
        ? Number(filters.foundedBefore)
        : undefined;
    const numPages = Math.max(1, Number(filters?.page) || 1);
    const limit = Math.max(1, Number(filters?.limit) || 10);

    const queryBuilder = this.museumRepository.createQueryBuilder('museum');
    if (city) {
      queryBuilder.andWhere('LOWER(museum.city) LIKE LOWER(:city)', { city: `%${city}%` });
    }

    if (name) {
      queryBuilder.andWhere('LOWER(museum.name) LIKE LOWER(:name)', { name: `%${name}%` });
    }

    if (foundedBefore) {
      queryBuilder.andWhere('museum.foundedBefore < :foundedBefore', {
        foundedBefore,
      });
    }

    const skip = (numPages - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const data = await queryBuilder.getMany();
    return data;
  }

  async findOne(id: string): Promise<MuseumEntity> {
    const museum: MuseumEntity | null = await this.museumRepository.findOne({
      where: { id },
      relations: ['artworks', 'exhibitions'],
    });
    if (!museum)
      throw new BusinessLogicException(
        'The museum with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return museum;
  }
  async create(museum: MuseumEntity): Promise<MuseumEntity> {
    return await this.museumRepository.save(museum);
  }
  async update(id: string, museum: MuseumEntity): Promise<MuseumEntity> {
    const persistedMuseum: MuseumEntity | null =
      await this.museumRepository.findOne({ where: { id } });
    if (!persistedMuseum)
      throw new BusinessLogicException(
        'The museum with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return await this.museumRepository.save({ ...persistedMuseum, ...museum });
  }
  async delete(id: string) {
    const museum: MuseumEntity | null = await this.museumRepository.findOne({
      where: { id },
    });
    if (!museum)
      throw new BusinessLogicException(
        'The museum with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.museumRepository.remove(museum);
  }
}
