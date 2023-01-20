import type { StoreCommandOptions } from './command.type';
import type { RegenStoreConfig } from './config.type';

export interface GenerateStoreParams {
  itemName: string;
  cliConfigFile: RegenStoreConfig;
  options: StoreCommandOptions;
}

export interface CommonGenerationParams {
  itemPath: string;
  filename: string;
  template: string;
}
