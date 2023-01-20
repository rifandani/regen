/* eslint-disable @typescript-eslint/ban-ts-comment */
import chalk from 'chalk';
import fsExtra from 'fs-extra';

import viewJsRouteTemplate from '../templates/view/viewJsRouteTemplate';
import viewJsViewModelTemplate from '../templates/view/viewJsViewModelTemplate';
import viewTestRouteTemplate from '../templates/view/viewTestRouteTemplate';
import viewTestViewDefaultTemplate from '../templates/view/viewTestViewDefaultTemplate';
import viewTestViewModelTemplate from '../templates/view/viewTestViewModelTemplate';
import viewTestViewTestingLibraryTemplate from '../templates/view/viewTestViewTestingLibraryTemplate';
import viewTsRouteTemplate from '../templates/view/viewTsRouteTemplate';
import viewTsViewModelTemplate from '../templates/view/viewTsViewModelTemplate';
import viewViewTemplate from '../templates/view/viewViewTemplate';
import { CommandItemOption } from '../types/command.type';
import { RegenViewTypeCustom } from '../types/config.type';
import type {
  CommonGenerationParams,
  GenerateViewParams,
  ViewTestTemplateGeneratorParams,
} from '../types/generateView.type';
import {
  customFileTemplateGenerator,
  getItemCustomTemplate,
  getItemFileTypes,
  preGenerate,
  replaceItemTemplateName,
} from './commonGenerate.util';

const { existsSync, outputFileSync } = fsExtra;

/**
 * View template generator.
 * If `customTemplates` key defined in CLI config file, then the returned object will be related to that `customTemplates`.
 */
function viewTemplateGenerator({ itemName, cliConfigFile, options }: GenerateViewParams) {
  const { usesTypeScript, testLibrary } = cliConfigFile;
  // @ts-ignore
  const { customTemplates } = cliConfigFile.view[options.type] as RegenViewTypeCustom;
  let template = null;
  let filename = null;

  // check for a custom view template in CLI config file
  if (customTemplates && customTemplates.view) {
    // Load and use the custom view template
    const { template: customTemplate, filename: customTemplateFilename } = getItemCustomTemplate(
      itemName,
      customTemplates.view
    );

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    // else, use built-in view template
    template = viewViewTemplate;
    filename = usesTypeScript ? `${itemName}.view.tsx` : `${itemName}.view.js`;

    // if test library is not Testing Library or if `withTest` is false, then remove `data-testid` from template
    if (testLibrary !== 'Testing Library' || !options.withTest) {
      template = template.replace(` data-testid="TemplateNameView"`, '');
    }
  }

  return {
    filename,
    template,
    itemPath: `${options.path}${options.flat ? '' : `/${itemName}`}/${filename}`,
  };
}

/**
 * View route template generator.
 * If `customTemplates` key defined in CLI config file, then the returned object will be related to that `customTemplates`.
 */
function viewRouteTemplateGenerator({ itemName, cliConfigFile, options }: GenerateViewParams) {
  const { usesTypeScript } = cliConfigFile;
  // @ts-ignore
  const { customTemplates } = cliConfigFile.view[options.type] as RegenViewTypeCustom;
  let template = null;
  let filename = null;

  // check for a custom view template in CLI config file
  if (customTemplates && customTemplates.view) {
    // Load and use the custom view template
    const { template: customTemplate, filename: customTemplateFilename } = getItemCustomTemplate(
      itemName,
      customTemplates.view
    );

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    // else, use built-in view template
    template = usesTypeScript ? viewTsRouteTemplate : viewJsRouteTemplate;
    filename = usesTypeScript ? `${itemName}.route.tsx` : `${itemName}.route.js`;
  }

  return {
    filename,
    template,
    itemPath: `${options.path}${options.flat ? '' : `/${itemName}`}/${filename}`,
  };
}

/**
 * View view model template generator.
 * If `customTemplates` key defined in CLI config file, then the returned object will be related to that `customTemplates`.
 */
function viewViewModelTemplateGenerator({ itemName, cliConfigFile, options }: GenerateViewParams) {
  const { usesTypeScript } = cliConfigFile;
  // @ts-ignore
  const { customTemplates } = cliConfigFile.view[options.type] as RegenViewTypeCustom;
  let template = null;
  let filename = null;

  // check for a custom view template in CLI config file
  if (customTemplates && customTemplates.view) {
    // Load and use the custom view template
    const { template: customTemplate, filename: customTemplateFilename } = getItemCustomTemplate(
      itemName,
      customTemplates.view
    );

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    // else, use built-in view template
    template = usesTypeScript ? viewTsViewModelTemplate : viewJsViewModelTemplate;
    filename = usesTypeScript ? `${itemName}.viewModel.tsx` : `${itemName}.viewModel.js`;
  }

  return {
    filename,
    template,
    itemPath: `${options.path}${options.flat ? '' : `/${itemName}`}/${filename}`,
  };
}

/**
 * View test template generator.
 * If `customTemplates` key defined in CLI config file, then the returned object will be related to that `customTemplates`.
 */
function viewTestTemplateGenerator({ itemType, itemName, cliConfigFile, options }: ViewTestTemplateGeneratorParams) {
  const { usesTypeScript, testLibrary } = cliConfigFile;
  // @ts-ignore
  const { customTemplates } = cliConfigFile.view[options.type] as RegenViewTypeCustom;
  let template = null;
  let filename = null;

  // check for a custom viewTest template
  if (customTemplates && customTemplates.viewTest) {
    // load and use the custom viewTest template
    const { template: customTemplate, filename: customTemplateFilename } = getItemCustomTemplate(
      itemName,
      customTemplates.viewTest
    );

    template = customTemplate;
    filename = customTemplateFilename;
  } else if (customTemplates && customTemplates.routeTest) {
    // load and use the custom routeTest template
    const { template: customTemplate, filename: customTemplateFilename } = getItemCustomTemplate(
      itemName,
      customTemplates.routeTest
    );

    template = customTemplate;
    filename = customTemplateFilename;
  } else if (customTemplates && customTemplates.viewModelTest) {
    // load and use the custom viewModelTest template
    const { template: customTemplate, filename: customTemplateFilename } = getItemCustomTemplate(
      itemName,
      customTemplates.viewModelTest
    );

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    filename = usesTypeScript ? `${itemName}.${itemType}.test.tsx` : `${itemName}.${itemType}.test.js`;

    if (itemType === 'view' && testLibrary === 'Testing Library') {
      template = viewTestViewTestingLibraryTemplate;
    } else if (itemType === 'route') {
      template = viewTestRouteTemplate;
    } else if (itemType === 'viewModel') {
      template = viewTestViewModelTemplate;
    } else {
      template = viewTestViewDefaultTemplate;
    }
  }

  return {
    filename,
    template,
    itemPath: `${options.path}${options.flat ? '' : `/${itemName}`}/${filename}`,
  };
}

// built-in view file types
const builtInViewFileTypes = {
  VIEW: 'view', // always executed, except if the view already exist in the path directory
  ROUTE: 'withRoute',
  VIEW_MODEL: 'withViewModel',
  TEST: 'withTest',
};

// generate view template map
const viewTemplateGeneratorMap = {
  [builtInViewFileTypes.VIEW]: viewTemplateGenerator, // always executed, except if the view already exist in the path directory
  [builtInViewFileTypes.ROUTE]: viewRouteTemplateGenerator,
  [builtInViewFileTypes.VIEW_MODEL]: viewViewModelTemplateGenerator,
  [builtInViewFileTypes.TEST]: viewTestTemplateGenerator,
};

/**
 * Generate view based on user inputs & CLI config file.
 *
 * @param {{ itemName: string; cliConfigFile: configObject; options: { path: string; type: string | 'default'; describe: string | null; flat: boolean; dryRun: boolean; debug: boolean; withTest: 'true' | 'false'; withStyle: 'true' | 'false'; withStory: 'true' | 'false'; withLazy: 'true' | 'false'; }}}
 */
export default function generateView({ itemName, cliConfigFile, options }: GenerateViewParams) {
  const spinner = preGenerate({ options });

  // get default view file types & test mapping
  const viewFileTypes = ['view', ...getItemFileTypes(options)];
  const testTypes = ['view', 'route', 'viewModel'];

  const commonGeneration = ({ itemPath, filename, template }: CommonGenerationParams) => {
    // make sure the view does not already exist in the path directory.
    if (existsSync(itemPath)) {
      spinner.fail(
        chalk.red(
          `${chalk.bold.italic.red(`"${filename}"`)} already exists in this path ${chalk.bold.italic.red(
            `"${itemPath}"`
          )}`
        )
      );
      return;
    }

    try {
      if (!options.dryRun) {
        // generate template file
        outputFileSync(itemPath, template);

        // replace the placeholder template name with the actual `itemName`
        replaceItemTemplateName(itemName, itemPath as CommandItemOption);
      }

      spinner.succeed(
        `${chalk.bold.italic.green(`"${filename}"`)} ${chalk.green(
          `was successfully created at`
        )} ${chalk.bold.italic.green(`"${itemPath}"`)}`
      );
    } catch (error) {
      spinner.fail(chalk.red(`${chalk.bold.italic.red(`"${filename}"`)} failed and was not created`));
      console.error(error);
    }
  };

  viewFileTypes.forEach((fileType) => {
    // generate templates only if the view options (e.g. withStyle, withTest, etc..) are true OR if the template type is "view"
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    if ((options[fileType] && options[fileType].toString() === 'true') || fileType === builtInViewFileTypes.VIEW) {
      if (fileType === builtInViewFileTypes.TEST) {
        // if `fileType` === `withTest`, loop thru test template generator
        testTypes.forEach((itemType) => {
          // run the template generator function
          const { itemPath, filename, template } = viewTestTemplateGenerator({
            itemType,
            itemName,
            cliConfigFile,
            options,
          });

          commonGeneration({ itemPath, filename, template });
        });
      } else {
        // get correct `generateTemplate` function based on the `fileType`
        const generateTemplate = viewTemplateGeneratorMap[fileType] || customFileTemplateGenerator;

        // run the `generateTemplate` function
        const { itemPath, filename, template } = generateTemplate({
          // @ts-ignore
          fileType,
          item: 'view',
          itemName,
          cliConfigFile,
          options,
        });

        commonGeneration({ itemPath, filename, template });
      }
    }
  });

  // if user inputs option `dryRun`
  if (options.dryRun) {
    console.log();
    spinner.warn(chalk.yellow(`NOTE: The ${chalk.bold.italic.yellow('"dry-run"')} flag means no changes were made`));
    console.log();
  }
}
