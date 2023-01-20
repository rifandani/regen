/* eslint-disable @typescript-eslint/ban-ts-comment */
import chalk from 'chalk';
import fsExtra from 'fs-extra';

import storeJsEntityAdapterTemplate from '../templates/store/storeJsEntityAdapterTemplate';
import storeJsTemplate from '../templates/store/storeJsTemplate';
import storeTestDefaultTemplate from '../templates/store/storeTestDefaultTemplate';
import storeTestEntityAdapterTemplate from '../templates/store/storeTestEntityAdapterTemplate';
import storeTsEntityAdapterTemplate from '../templates/store/storeTsEntityAdapterTemplate';
import storeTsTemplate from '../templates/store/storeTsTemplate';
import { CommandItemOption } from '../types/command.type';
import { RegenStoreTypeCustom } from '../types/config.type';
import type { GenerateStoreParams } from '../types/generateStore.type';
import {
  customFileTemplateGenerator,
  getItemCustomTemplate,
  getItemFileTypes,
  preGenerate,
  replaceItemTemplateName,
} from './commonGenerate.util';

const { existsSync, outputFileSync } = fsExtra;

/**
 * Store template generator. If `customTemplate` key defined in CLI config file, then the returned object will be related to that `customTemplate`.
 */
function storeTemplateGenerator({ itemName, cliConfigFile, options }: GenerateStoreParams) {
  const { usesTypeScript } = cliConfigFile;
  // @ts-ignore
  const { customTemplates, useEntityAdapter } = cliConfigFile.store[options.type] as RegenStoreTypeCustom;
  let template = null;
  let filename = null;

  // check for a custom store template in CLI config file
  if (customTemplates && customTemplates.store) {
    // load and use the custom store template
    const { template: customTemplate, filename: customTemplateFilename } = getItemCustomTemplate(
      itemName,
      customTemplates.store
    );

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    // else, use built-in store template
    filename = usesTypeScript ? `${itemName}.store.ts` : `${itemName}.store.js`;

    if (usesTypeScript) {
      template = options.useEntityAdapter || useEntityAdapter ? storeTsEntityAdapterTemplate : storeTsTemplate;
    } else {
      template = options.useEntityAdapter || useEntityAdapter ? storeJsEntityAdapterTemplate : storeJsTemplate;
    }
  }

  return {
    filename,
    template,
    itemPath: `${options.path}${options.flat ? '' : `/${itemName}`}/${filename}`,
  };
}

/**
 * Store test template generator. If `customTemplate` key defined in CLI config file, then the returned object will be related to that `customTemplate`.
 */
function storeTestTemplateGenerator({ itemName, cliConfigFile, options }: GenerateStoreParams) {
  const { usesTypeScript } = cliConfigFile;
  // @ts-ignore
  const { customTemplates, useEntityAdapter } = cliConfigFile.store[options.type] as RegenStoreTypeCustom;
  let template = null;
  let filename = null;

  // check for a custom store test template in CLI config file
  if (customTemplates && customTemplates.test) {
    // load and use the custom store test template
    const { template: customTemplate, filename: customTemplateFilename } = getItemCustomTemplate(
      itemName,
      customTemplates.test
    );

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    // else, use built-in store template
    filename = usesTypeScript ? `${itemName}.store.test.ts` : `${itemName}.store.test.js`;
    template = options.useEntityAdapter || useEntityAdapter ? storeTestEntityAdapterTemplate : storeTestDefaultTemplate;
  }

  return {
    filename,
    template,
    itemPath: `${options.path}${options.flat ? '' : `/${itemName}`}/${filename}`,
  };
}

// built-in store file types
const builtInStoreFileTypes = {
  STORE: 'store', // always executed, except if the store already exist in the path directory
  TEST: 'withTest',
};

// generate store template map
const storeTemplateGeneratorMap = {
  [builtInStoreFileTypes.STORE]: storeTemplateGenerator, // always executed, except if the store already exist in the path directory
  [builtInStoreFileTypes.TEST]: storeTestTemplateGenerator,
};

/**
 * Generate store based on user inputs & CLI config file.
 */
export default function generateStore({ itemName, cliConfigFile, options }: GenerateStoreParams) {
  const spinner = preGenerate({ options });

  // get default store file types
  const storeFileTypes = ['store', ...getItemFileTypes(options)];

  storeFileTypes.forEach((fileType, idx) => {
    const lastIteration = idx === storeFileTypes.length - 1;

    // generate templates only if the store options (e.g. withTest, etc..) are true OR if the template type is "store"
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    if ((options[fileType] && options[fileType].toString() === 'true') || fileType === builtInStoreFileTypes.STORE) {
      // start loading spinner
      spinner.start(chalk.cyan(`Generating store...`));

      // get correct `generateTemplate` function based on the `fileType`
      const generateTemplate = storeTemplateGeneratorMap[fileType] || customFileTemplateGenerator;

      // run the `generateTemplate` function
      const { itemPath, filename, template } = generateTemplate({
        // @ts-ignore
        fileType,
        item: 'store',
        itemName,
        cliConfigFile,
        options,
      });

      // make sure the store does not already exist in the path directory.
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

        if (lastIteration) {
          console.log(chalk.cyan(`💡 Don't forget to add your newly added reducer to your root store config`));
          console.log(
            chalk.cyan(`💡 If you want to persist it, don't forget to whitelist it in your persistor config`)
          );
        }
      } catch (error) {
        spinner.fail(chalk.red(`${chalk.bold.italic.red(`"${filename}"`)} failed and was not created`));
        console.error(error);
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
