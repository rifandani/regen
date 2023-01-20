import type { ScaffoldCommandOptions } from './command.type';
import type { RegenScaffoldConfig } from './config.type';

export interface GenerateScaffoldParams {
  url: string;
  cliConfigFile: RegenScaffoldConfig;
  options: ScaffoldCommandOptions;
}
