/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { MuseumService } from './museum.service';
import { MuseumEntity } from './museum.entity/museum.entity';

describe('MuseumService – filters & pagination', () => {
  let service: MuseumService;
  let repo: Repository<MuseumEntity>;
  let seeded: MuseumEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MuseumService],
    }).compile();

    service = module.get<MuseumService>(MuseumService);
    repo = module.get<Repository<MuseumEntity>>(getRepositoryToken(MuseumEntity));
    await seedmuseosbase();
  });

  const seedmuseosbase = async () => {
    await repo.clear();
    seeded = [];

    const museos: Array<Partial<MuseumEntity>> = [
      { name: 'Museo del Oro 1', city: 'Bogota', foundedBefore: 1800, description: 'd', address: 'a', image: 'http://img/1' },
      { name: 'Museo del Oro 2', city: 'Bogotá', foundedBefore: 1850, description: 'd', address: 'a', image: 'http://img/2' },
      { name: 'Museo Nacional', city: 'Bogota', foundedBefore: 1823, description: 'd', address: 'a', image: 'http://img/3' },
      { name: 'Arte Moderno', city: 'Medellin', foundedBefore: 1950, description: 'd', address: 'a', image: 'http://img/4' },
      { name: 'Colonial', city: 'Cartagena', foundedBefore: 1700, description: 'd', address: 'a', image: 'http://img/5' },
      { name: 'Museo del ORO 3', city: 'bogota', foundedBefore: 1600, description: 'd', address: 'a', image: 'http://img/6' },
      { name: 'Histórico', city: 'Cali', foundedBefore: 2000, description: 'd', address: 'a', image: 'http://img/7' },
      { name: 'Museo Antiguo', city: 'Bogota D.C.', foundedBefore: 1899, description: 'd', address: 'a', image: 'http://img/8' },
    ];

    while (museos.length < 25) {
      museos.push({
        name: `Genérico ${museos.length + 1}`,
        city: museos.length % 2 === 0 ? 'Bogota' : 'Medellin',
        foundedBefore: 1900 + (museos.length % 120),
        description: 'd',
        address: 'a',
        image: `http://img/${museos.length + 1}`,
      });
    }

    for (const m of museos) {
      const saved = await repo.save(m as MuseumEntity);
      seeded.push(saved);
    }
  };

  it('usa defaults cuando no se envían page/limit (page=1, limit=10)', async () => {
    const result = await service.findAll({});
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(10); 
  });

  it('aplica limit y page correctamente', async () => {
    const page1 = await service.findAll({ page: '1', limit: '5' });
    const page2 = await service.findAll({ page: '2', limit: '5' });

    expect(page1.length).toBe(5);
    expect(page2.length).toBe(5);

    const ids1 = new Set(page1.map(m => m.id));
    const overlap = page2.some(m => ids1.has(m.id));
    expect(overlap).toBe(false);
  });

  it('filtra por name', async () => {
    const result = await service.findAll({ name: 'oro', page: '1', limit: '50' });
    expect(result.length).toBeGreaterThan(0);
    for (const m of result) {
      expect(m.name.toLowerCase()).toContain('oro');
    }
  });

  it('filtra por city', async () => {
    const result = await service.findAll({ city: 'bogota', page: '1', limit: '50' });
    expect(result.length).toBeGreaterThan(0);
    for (const m of result) {
      expect(m.city.toLowerCase()).toContain('bogota');
    }
  });

  it('filtra por foundedBefore', async () => {
    const result = await service.findAll({ foundedBefore: '1900', page: '1', limit: '100' });
    expect(result.length).toBeGreaterThan(0);
    for (const m of result) {
      expect(m.foundedBefore).toBeLessThan(1900);
    }
  });

  it('combina filtros y paginación (name + city + page/limit)', async () => {
    const result = await service.findAll({
      name: 'oro',
      city: 'bogota',
      page: '1',
      limit: '2',
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThanOrEqual(2);
    for (const m of result) {
      expect(m.name.toLowerCase()).toContain('oro');
      expect(m.city.toLowerCase()).toContain('bogota');
    }
  });

  it('corrige parámetros inválidos: page/limit negativos o cero', async () => {
    const result = await service.findAll({ page: '0', limit: '-5' });
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThanOrEqual(10);
  });

  it('ignora foundedBefore inválido y no rompe', async () => {
    const result = await service.findAll({ foundedBefore: 'no-num', page: '1', limit: '10' });
    expect(result.length).toBe(10);
  });
});
