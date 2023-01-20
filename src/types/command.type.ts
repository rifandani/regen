import type { Except } from 'type-fest';

export type CLIConfig = 'component' | 'hook' | 'view' | 'scaffold' | 'store';
export type CommandItemOption = 'component' | 'hook' | 'view' | 'scaffold' | 'store';
export type CommandItemTypeOption<T extends string> = T | 'default' | 'custom';
export type CustomTemplates = Record<CommandItemOption | 'test', string>;

export type CommonCommandOptions = {
  flat: boolean;
  dryRun: boolean;
  debug: boolean;
};

// #region COMPONENT
type ComponentCommandOptionsBase = {
  path: string;
  describe: string | undefined;
  withStyle: boolean;
  withLazy: boolean;
  withStory: boolean;
  withTest: boolean;
};
export type ComponentCommandOptions = CommonCommandOptions &
  ComponentCommandOptionsBase &
  (
    | {
        type: 'default'; // OR any `string`
      }
    | { type: 'custom' }
  );
// #endregion

// #region HOOK
type HookCommandOptionsBase = {
  path: string;
  describe: string | undefined;
  withTest: boolean;
};
export type HookCommandOptions = CommonCommandOptions &
  HookCommandOptionsBase &
  (
    | {
        type: 'default'; // OR any `string`
      }
    | { type: 'custom' }
  );
// #endregion

// #region VIEW
type ViewCommandOptionsBase = {
  path: string;
  withRoute: boolean;
  withViewModel: boolean;
  withTest: boolean;
};
export type ViewCommandOptions = CommonCommandOptions &
  ViewCommandOptionsBase &
  (
    | {
        type: 'default'; // OR any `string`
      }
    | { type: 'custom' }
  );
// #endregion

// #region STORE
type StoreCommandOptionsBase = {
  path: string;
  withTest: boolean;
  useEntityAdapter: boolean;
};
export type StoreCommandOptions = CommonCommandOptions &
  StoreCommandOptionsBase &
  (
    | {
        type: 'default'; // OR any `string`
      }
    | { type: 'custom' }
  );
// #endregion

// #region SCAFFOLD
export type ScaffoldCommandOptions = Except<CommonCommandOptions, 'flat'> & {
  type: 'default'; // OR any `string`
};
// #endregion

export type CommandWithOptions = {
  withTest: boolean;

  withStyle?: boolean;
  withLazy?: boolean;
  withStory?: boolean;

  withRoute?: boolean;
  withViewModel?: boolean;
};
