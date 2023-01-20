import type {
  CommandItemOption,
  CommonCommandOptions,
  ComponentCommandOptions,
  HookCommandOptions,
} from './command.type';
import type {
  RegenComponentTypeCustom,
  RegenComponentTypeCustomKey,
  RegenComponentTypeNormal,
  RegenHookTypeCustom,
  RegenHookTypeCustomKey,
  RegenHookTypeNormal,
  RegenScaffoldTypeNormal,
  RegenScaffoldTypeNormalKey,
  RegenStoreTypeCustom,
  RegenStoreTypeCustomKey,
  RegenStoreTypeNormal,
  RegenViewTypeCustom,
  RegenViewTypeCustomKey,
  RegenViewTypeNormal,
} from './config.type';

export interface CustomFileTemplateGeneratorParams {
  fileType: string;
  item: CommandItemOption;
  itemName: string;
  cliConfigFile: Record<string, unknown>;
  options: ComponentCommandOptions;
}

export interface PreGenerateParams {
  options: Omit<CommonCommandOptions, 'flat'>;
}

export type CommonSelectedItemType = ComponentCommandOptions | HookCommandOptions;

export type GetItemFileTypesParams =
  | RegenComponentTypeNormal
  | RegenComponentTypeCustom
  | RegenHookTypeNormal
  | RegenHookTypeCustom
  | RegenViewTypeNormal
  | RegenViewTypeCustom
  | RegenStoreTypeNormal
  | RegenStoreTypeCustom
  | RegenScaffoldTypeNormal;

export type GetItemFileTypesResult =
  | Exclude<RegenComponentTypeCustomKey, 'path'>
  | Exclude<RegenHookTypeCustomKey, 'path'>
  | Exclude<RegenViewTypeCustomKey, 'path'>
  | Exclude<RegenStoreTypeCustomKey, 'path' | 'useEntityAdapter'>
  | RegenScaffoldTypeNormalKey;
