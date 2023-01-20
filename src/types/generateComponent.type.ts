import type { ComponentCommandOptions } from './command.type';
import type { RegenComponentConfig } from './config.type';

export interface GenerateComponentParams {
  itemName: string;
  cliConfigFile: RegenComponentConfig;
  options: ComponentCommandOptions;
}
