type RegenProjectConfig = {
  usesTypeScript: boolean;
  usesCssModule: boolean;
  cssPreprocessor: 'css' | 'scss' | 'less' | 'styl';
  testLibrary: 'Testing Library' | 'Enzyme' | 'None';
};

// #region COMPONENT
type RegenComponentTypeNormalKey = 'path' | 'withStyle' | 'withLazy' | 'withStory' | 'withTest';
export type RegenComponentTypeNormal = {
  path: string;
  withStyle: boolean;
  withLazy: boolean;
  withStory: boolean;
  withTest: boolean;
};
export type RegenComponentTypeNormalObj = {
  default: RegenComponentTypeNormal; // OR any 'string' key
};

export type RegenComponentTypeCustomKey = RegenComponentTypeNormalKey | 'customTemplates';
type RegenComponentTypeCustomTemplatesKey = 'component' | 'style' | 'lazy' | 'story' | 'test';
export type RegenComponentTypeCustom = RegenComponentTypeNormal & {
  customTemplates: Record<RegenComponentTypeCustomTemplatesKey, string>;
};
export type RegenComponentTypeCustomObj = {
  custom: RegenComponentTypeCustom;
};

export type RegenComponentConfig =
  | (RegenProjectConfig & {
      component: RegenComponentTypeNormalObj;
    })
  | (RegenProjectConfig & {
      component: RegenComponentTypeCustomObj;
    });
// #endregion

// #region HOOK
type RegenHookTypeNormalKey = 'path' | 'withTest';
export type RegenHookTypeNormal = {
  path: string;
  withTest: boolean;
};
export type RegenHookTypeNormalObj = {
  default: RegenHookTypeNormal; // OR any 'string' key
};

export type RegenHookTypeCustomKey = RegenHookTypeNormalKey | 'customTemplates';
type RegenHookTypeCustomTemplatesKey = 'hook' | 'test';
export type RegenHookTypeCustom = RegenHookTypeNormal & {
  customTemplates: Record<RegenHookTypeCustomTemplatesKey, string>;
};
export type RegenHookTypeCustomObj = {
  custom: RegenHookTypeCustom;
};

export type RegenHookConfig =
  | (RegenProjectConfig & {
      hook: RegenHookTypeNormalObj;
    })
  | (RegenProjectConfig & {
      hook: RegenHookTypeCustomObj;
    });
// #endregion

// #region VIEW
type RegenViewTypeNormalKey = 'path' | 'withRoute' | 'withViewModel' | 'withTest';
export type RegenViewTypeNormal = {
  path: string;
  withRoute: boolean;
  withViewModel: boolean;
  withTest: boolean;
};
export type RegenViewTypeNormalObj = {
  default: RegenViewTypeNormal; // OR any 'string' key
};

export type RegenViewTypeCustomKey = RegenViewTypeNormalKey | 'customTemplates';
type RegenViewTypeCustomTemplatesKey = 'view' | 'route' | 'viewModel' | 'viewTest' | 'routeTest' | 'viewModelTest';
export type RegenViewTypeCustom = RegenViewTypeNormal & {
  customTemplates: Record<RegenViewTypeCustomTemplatesKey, string>;
};
export type RegenViewTypeCustomObj = {
  custom: RegenViewTypeCustom;
};

export type RegenViewConfig =
  | (RegenProjectConfig & {
      view: RegenViewTypeNormalObj;
    })
  | (RegenProjectConfig & {
      view: RegenViewTypeCustomObj;
    });
// #endregion

// #region STORE
type RegenStoreTypeNormalKey = 'path' | 'withTest' | 'useEntityAdapter';
export type RegenStoreTypeNormal = {
  path: string;
  withTest: boolean;
  useEntityAdapter: boolean;
};
export type RegenStoreTypeNormalObj = {
  default: RegenStoreTypeNormal; // OR any 'string' key
};

export type RegenStoreTypeCustomKey = RegenStoreTypeNormalKey | 'customTemplates';
type RegenStoreTypeCustomTemplatesKey = 'store' | 'test';
export type RegenStoreTypeCustom = RegenStoreTypeNormal & {
  customTemplates: Record<RegenStoreTypeCustomTemplatesKey, string>;
};
export type RegenStoreTypeCustomObj = {
  custom: RegenStoreTypeCustom;
};

export type RegenStoreConfig =
  | (RegenProjectConfig & {
      store: RegenStoreTypeNormalObj;
    })
  | (RegenProjectConfig & {
      store: RegenStoreTypeCustomObj;
    });
// #endregion

// #region SCAFFOLD
export type RegenScaffoldTypeNormalKey = 'url' | 'command';
export type RegenScaffoldTypeNormal =
  | {
      url: string;
    }
  | { command: string };
export type RegenScaffoldTypeNormalObj = {
  default: RegenScaffoldTypeNormal; // OR any 'string' key
};

export type RegenScaffoldConfig = RegenProjectConfig & {
  scaffold: RegenScaffoldTypeNormalObj;
};
// #endregion

export type RegenConfig = RegenComponentConfig &
  RegenHookConfig &
  RegenViewConfig &
  RegenStoreConfig &
  RegenScaffoldConfig;

export type RegenConfigItemObj =
  | RegenComponentTypeNormalObj
  | RegenComponentTypeCustomObj
  | RegenHookTypeNormalObj
  | RegenHookTypeCustomObj
  | RegenViewTypeNormalObj
  | RegenViewTypeCustomObj
  | RegenStoreTypeNormalObj
  | RegenStoreTypeCustomObj
  | RegenScaffoldTypeNormalObj;
