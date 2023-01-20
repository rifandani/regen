/* eslint-disable @typescript-eslint/ban-ts-comment */
import chalk from 'chalk';
import fsExtra from 'fs-extra';

import aiItemTemplateGenerator from '../services/openAi.service';
import hookJsTemplate from '../templates/hook/hookJsTemplate';
import hookTestDefaultTemplate from '../templates/hook/hookTestDefaultTemplate';
import hookTestTestingLibraryTemplate from '../templates/hook/hookTestTestingLibraryTemplate';
import hookTsTemplate from '../templates/hook/hookTsTemplate';
import { CommandItemOption } from '../types/command.type';
import { RegenHookTypeCustom } from '../types/config.type';
import { GenerateHookParams } from '../types/generateHook.type';
import {
  customFileTemplateGenerator,
  getItemCustomTemplate,
  getItemFileTypes,
  preGenerate,
  replaceItemTemplateName,
} from './commonGenerate.util';

const { existsSync, outputFileSync } = fsExtra;

/**
 * Hook template generator. If `customTemplate` key defined in CLI config file, then the returned object will be related to that `customTemplate`.
 */
function hookTemplateGenerator({ itemName, cliConfigFile, options }: GenerateHookParams) {
  const { usesTypeScript } = cliConfigFile;
  // @ts-ignore
  const { customTemplates } = cliConfigFile.hook[options.type] as RegenHookTypeCustom;
  let template = null;
  let filename = null;

  // check for a custom hook template in CLI config file
  if (customTemplates && customTemplates.hook) {
    // load and use the custom hook template
    const { template: customTemplate, filename: customTemplateFilename } = getItemCustomTemplate(
      itemName,
      customTemplates.hook
    );

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    // else, use built-in hook template
    template = usesTypeScript ? hookTsTemplate : hookJsTemplate;
    filename = usesTypeScript ? `${itemName}.hook.tsx` : `${itemName}.hook.js`;
  }

  return {
    filename,
    template,
    itemPath: `${options.path}${options.flat ? '' : `/${itemName}`}/${filename}`,
  };
}

/**
 * Hook test template generator. If `customTemplate` key defined in CLI config file, then the returned object will be related to that `customTemplate`.
 */
function hookTestTemplateGenerator({ itemName, cliConfigFile, options }: GenerateHookParams) {
  const { usesTypeScript, testLibrary } = cliConfigFile;
  // @ts-ignore
  const { customTemplates } = cliConfigFile.hook[options.type] as RegenHookTypeCustom;
  let template = null;
  let filename = null;

  // check for a custom hook test template in CLI config file
  if (customTemplates && customTemplates.test) {
    // load and use the custom hook test template
    const { template: customTemplate, filename: customTemplateFilename } = getItemCustomTemplate(
      itemName,
      customTemplates.test
    );

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    // else, use built-in hook template
    filename = usesTypeScript ? `${itemName}.hook.test.tsx` : `${itemName}.hook.test.js`;

    if (testLibrary === 'Testing Library') {
      template = hookTestTestingLibraryTemplate;
    } else {
      template = hookTestDefaultTemplate;
    }
  }

  return {
    filename,
    template,
    itemPath: `${options.path}${options.flat ? '' : `/${itemName}`}/${filename}`,
  };
}

// built-in hook file types
const builtInHookFileTypes = {
  HOOK: 'hook', // always executed, except if the hook already exist in the path directory
  TEST: 'withTest',
};

// generate hook template map
const hookTemplateGeneratorMap = {
  [builtInHookFileTypes.HOOK]: hookTemplateGenerator, // always executed, except if the hook already exist in the path directory
  [builtInHookFileTypes.TEST]: hookTestTemplateGenerator,
};

/**
 * Generate hook based on user inputs & CLI config file.
 */
export default function generateHook({ itemName, cliConfigFile, options }: GenerateHookParams) {
  const spinner = preGenerate({ options });

  // get default hook file types
  const hookFileTypes = ['hook', ...getItemFileTypes(options)];

  hookFileTypes.forEach((fileType) => {
    // generate templates only if the hook options (e.g. withTest, etc..) are true OR if the template type is "hook"
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    if ((options[fileType] && options[fileType].toString() === 'true') || fileType === builtInHookFileTypes.HOOK) {
      // start loading spinner
      spinner.start(chalk.cyan(`Generating hook...`));

      // get correct `generateTemplate` function based on the `fileType`
      const generateTemplate = hookTemplateGeneratorMap[fileType] || customFileTemplateGenerator;

      // run the `generateTemplate` function
      const { itemPath, filename, template } = generateTemplate({
        // @ts-ignore
        fileType,
        item: 'hook',
        itemName,
        cliConfigFile,
        options,
      });

      // make sure the hook does not already exist in the path directory.
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

        // generate hook with OpenAI, if hook description is provided
        if (options.describe && fileType === builtInHookFileTypes.HOOK) {
          aiItemTemplateGenerator({
            item: 'hook',
            isTest: false,
            itemTemplate: template,
            instructions: options.describe,
          })
            .then((aiGeneratedHook) => {
              // output the file from AI-generated template
              if (!options.dryRun) {
                outputFileSync(itemPath, aiGeneratedHook?.trim());
              }

              spinner.succeed(
                chalk.green(
                  `OpenAI successfully created the ${chalk.bold.italic.green(
                    `"${filename}"`
                  )} hook with the provided description`
                )
              );
            })
            .catch((error) =>
              spinner.fail(
                chalk.red(
                  `OpenAI failed to create the ${chalk.bold.italic.red(
                    `"${filename}"`
                  )} hook with the provided description`,
                  error
                )
              )
            );

          return;
        }

        // generate hook unit tests with OpenAI, if hook description is provided
        if (options.describe && fileType === builtInHookFileTypes.TEST) {
          aiItemTemplateGenerator({
            item: 'hook',
            isTest: true,
            itemTemplate: template,
            instructions: options.describe,
          })
            .then((aiGeneratedComponent) => {
              // output the file from AI-generated template
              if (!options.dryRun) {
                outputFileSync(itemPath, aiGeneratedComponent?.trim());
              }

              spinner.succeed(
                chalk.green(
                  `OpenAI successfully created the ${chalk.bold.italic.green(
                    `"${filename}"`
                  )} hook unit tests with the provided description`
                )
              );
            })
            .catch((error) =>
              spinner.fail(
                chalk.red(
                  `OpenAI failed to create the ${chalk.bold.italic.red(
                    `"${filename}"`
                  )} hook unit tests with the provided description`,
                  error
                )
              )
            );

          return;
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
    }
  });

  // if user inputs option `dryRun`
  if (options.dryRun) {
    console.log();
    spinner.warn(chalk.yellow(`NOTE: The ${chalk.bold.italic.yellow('"dry-run"')} flag means no changes were made`));
    console.log();
  }
}
