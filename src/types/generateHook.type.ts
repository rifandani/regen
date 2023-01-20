import type { HookCommandOptions } from './command.type';
import type { RegenHookConfig } from './config.type';

export interface GenerateHookParams {
  itemName: string;
  cliConfigFile: RegenHookConfig;
  options: HookCommandOptions;
}
