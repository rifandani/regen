/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import chalk from 'chalk';
import fsExtra from 'fs-extra';
import { camelCase, kebabCase, snakeCase, startCase } from 'lodash';
import ora from 'ora';
import path from 'path';
import replace from 'replace';

import type { CommandItemOption } from '../types/command.type';
import type {
  CustomFileTemplateGeneratorParams,
  GetItemFileTypesParams,
  PreGenerateParams,
} from '../types/commonGenerate.type';

const { readFileSync } = fsExtra;

/**
 * Replace the placeholder "template name" with the actual "item" name.
 * "item" is a placeholder that could be replaced by "component" / "hook" / "view".
 */
export function replaceItemTemplateName(itemName: string, itemPath: CommandItemOption) {
  const commonReplaceOptions = {
    paths: [itemPath],
    recursive: false,
    silent: true,
  };

  // will replace the `templatename` in whichever format the user typed the item name in the command.
  replace({
    ...commonReplaceOptions,
    regex: 'templatename',
    replacement: itemName,
  });

  // will replace the `TemplateName` in PascalCase
  replace({
    ...commonReplaceOptions,
    regex: 'TemplateName',
    replacement: startCase(camelCase(itemName)).replace(/ /g, ''),
  });

  // will replace the `templateName` in camelCase
  replace({
    ...commonReplaceOptions,
    regex: 'templateName',
    replacement: camelCase(itemName),
  });

  // will replace the `template-name` in kebab-case
  replace({
    ...commonReplaceOptions,
    regex: 'template-name',
    replacement: kebabCase(itemName),
  });

  // will replace the `template_name` in snake_case
  replace({
    ...commonReplaceOptions,
    regex: 'template_name',
    replacement: snakeCase(itemName),
  });

  // will replace the `TEMPLATE_NAME` in uppercase SNAKE_CASE
  replace({
    ...commonReplaceOptions,
    regex: 'TEMPLATE_NAME',
    replacement: snakeCase(itemName).toUpperCase(),
  });
}

/**
 * Get the specified "customTemplate" from CLI config file.
 * "item" is a placeholder that could be replaced by "component" / "hook" / "view".
 * returns: object | throw error
 */
export function getItemCustomTemplate(itemName: string, templatePath: string) {
  try {
    // load custom template
    const template = readFileSync(templatePath, 'utf8');

    // replace reserved keyword "TemplateName" with the `itemName`
    const filename = path.basename(templatePath).replace('TemplateName', itemName);

    return { template, filename };
  } catch (e) {
    console.error(
      chalk.red(
        `ERROR: The custom template path of ${chalk.bold.italic.red(
          `"${templatePath}"`
        )} does not exist. Please make sure you're pointing to the right custom template path in your ${chalk.bold.italic.red(
          'regen.json'
        )} config file.`
      )
    );

    // exit program
    return process.exit(1);
  }
}

/**
 * Custom template generator.
 * If `customTemplates` key defined in CLI config file, then the returned object will be related to that `customTemplates`.
 * "item" is a placeholder that could be replaced by "component" / "hook" / "view".
 * returns: object | throw error
 */
export function customFileTemplateGenerator({
  fileType,
  item,
  itemName,
  cliConfigFile,
  options,
}: CustomFileTemplateGeneratorParams) {
  const configItem = cliConfigFile[item] as any;
  const { customTemplates } = configItem[options.type];
  const type = camelCase(fileType.split('with')[1]); // (e.g 'test')

  // check for a valid custom template for the corresponding custom item file
  if (!customTemplates || !customTemplates[type]) {
    console.error(
      chalk.red(
        `ERROR: Custom ${item} files require a valid custom template. Please make sure you're pointing to the right custom template path in your ${chalk.bold.italic.red(
          'regen.json'
        )} config file.`
      )
    );

    // exit early
    return process.exit(1);
  }

  // load and use the custom item template
  const { template: customTemplate, filename: customTemplateFilename } = getItemCustomTemplate(
    itemName,
    customTemplates[type] as CommandItemOption
  );

  return {
    filename: customTemplateFilename,
    template: customTemplate,
    itemPath: `${options.path}${options.flat ? '' : `/${itemName}`}/${customTemplateFilename}`,
  };
}

/**
 * Get "item" type from CLI config file.
 * returns: `cliConfigFile.item[itemType] | cliConfigFile.item.default | throw error`
 */
export function getItemByType(
  item: CommandItemOption,
  args: NodeJS.Process['argv'],
  cliConfigFile: Record<string, unknown>
) {
  const configItem = cliConfigFile[item] as any;

  // check if input user includes "--type" OR "-t" option
  const itemTypeOptionIndex = args.findIndex((arg) => arg === '--type' || arg === '-t');

  // check if `args` includes `item` & `itemTypeOptionIndex` is found
  const isCorrectItemAndFound = args.includes(item) && itemTypeOptionIndex !== -1;

  if (isCorrectItemAndFound) {
    const itemType = args[itemTypeOptionIndex + 1]; // get the "item" type value from user input
    const selectedConfigItemType = configItem[itemType]; // get the value from the CLI config file

    if (!selectedConfigItemType) {
      // if the selected "item" type does not exists in the `cliConfigFile[item]`
      console.error(
        chalk.red(
          `ERROR: Please make sure ${chalk.bold.italic.red(
            `"${itemType}"`
          )} you're trying to use exists in the ${chalk.bold.italic.red(
            `"regen.json"`
          )} config file under the ${chalk.bold.italic.red(`"${item}"`)} object`
        )
      );

      // exit early
      process.exit(1);
    }

    // otherwise return it
    return selectedConfigItemType;
  }

  // otherwise return the default CLI config "item" type
  return configItem.default;
}

/**
 * Get keys array and filter out the key from `itemType` object that includes string `with`.
 * params: `itemType` got from returned `getItemByType` function.
 * returns: (e.g `['withTest']` for "hook" item ~~~ `['withStyle', 'withStory', 'withLazy', 'withTest']` for "component" item ~~~ `['withRoute', 'withViewModel', 'withTest']` for "view" item)
 */
export function getItemFileTypes(itemType: GetItemFileTypesParams) {
  return Object.keys(itemType).filter((key) => key.split('with').length > 1);
}

/**
 * run things before doing "generate"
 */
export function preGenerate({ options }: PreGenerateParams) {
  // create loading spinner
  const spinner = ora({
    discardStdin: false,
  });

  // if user inputs option `debug`
  if (options.debug) {
    console.log();
    spinner.info(chalk.blue('INFO: Debug options:'));
    console.log(options, '\n');
  }

  return spinner;
}
