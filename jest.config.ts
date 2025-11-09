// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': [
      'ts-jest',
      { useESM: true, tsconfig: 'tsconfig.spec.json' },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'], 
  moduleFileExtensions: ['ts', 'js', 'json'],
  // Workaround: imports relativos que a veces quedan con .js al final
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  // (opcional) si usas paths de TS, mapea aquí con ts-jest/utils
};

export default config;