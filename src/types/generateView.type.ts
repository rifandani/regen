import type { ViewCommandOptions } from './command.type';
import type { RegenViewConfig } from './config.type';

export interface GenerateViewParams {
  itemName: string;
  cliConfigFile: RegenViewConfig;
  options: ViewCommandOptions;
}

export interface ViewTestTemplateGeneratorParams {
  itemType: string; // "view" | "route" | "viewModel"
  itemName: string;
  cliConfigFile: RegenViewConfig;
  options: ViewCommandOptions;
}

export interface CommonGenerationParams {
  itemPath: string;
  filename: string;
  template: string;
}
