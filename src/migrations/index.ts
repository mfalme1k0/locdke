import * as migration_20260929_103737_initial from './20260929_103737_initial';

export const migrations = [
  {
    up: migration_20260929_103737_initial.up,
    down: migration_20260929_103737_initial.down,
    name: '20260929_103737_initial'
  },
];
