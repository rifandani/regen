/* eslint-disable @typescript-eslint/ban-ts-comment */
import chalk from 'chalk';
import fsExtra from 'fs-extra';

import aiItemTemplateGenerator from '../services/openAi.service';
import componentCssTemplate from '../templates/component/componentCssTemplate';
import componentJsTemplate from '../templates/component/componentJsTemplate';
import componentLazyTemplate from '../templates/component/componentLazyTemplate';
import componentStoryTemplate from '../templates/component/componentStoryTemplate';
import componentTestDefaultTemplate from '../templates/component/componentTestDefaultTemplate';
import componentTestEnzymeTemplate from '../templates/component/componentTestEnzymeTemplate';
import componentTestTestingLibraryTemplate from '../templates/component/componentTestTestingLibraryTemplate';
import componentTsLazyTemplate from '../templates/component/componentTsLazyTemplate';
import componentTsTemplate from '../templates/component/componentTsTemplate';
import type { CommandItemOption } from '../types/command.type';
import { RegenComponentTypeCustom } from '../types/config.type';
import type { GenerateComponentParams } from '../types/generateComponent.type';
import {
  customFileTemplateGenerator,
  getItemCustomTemplate,
  getItemFileTypes,
  preGenerate,
  replaceItemTemplateName,
} from './commonGenerate.util';

const { existsSync, outputFileSync } = fsExtra;

/**
 * Component template generator.
 * If `customTemplates` key defined in CLI config file, then the returned object will be related to that `customTemplates`.
 */
function componentTemplateGenerator({ itemName, cliConfigFile, options }: GenerateComponentParams) {
  const { usesTypeScript, usesCssModule, cssPreprocessor, testLibrary } = cliConfigFile;
  // @ts-ignore
  const { customTemplates } = cliConfigFile.component[options.type] as RegenComponentTypeCustom;
  let template = null;
  let filename = null;

  // check for a custom component template in CLI config file
  if (customTemplates && customTemplates.component) {
    // Load and use the custom component template
    const { template: customTemplate, filename: customTemplateFilename } = getItemCustomTemplate(
      itemName,
      customTemplates.component
    );

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    // else, use built-in component template
    template = usesTypeScript ? componentTsTemplate : componentJsTemplate;
    filename = usesTypeScript ? `${itemName}.tsx` : `${itemName}.js`;

    // if test library is not Testing Library or if `withTest` is false, then remove `data-testid` from template
    if (testLibrary !== 'Testing Library' || !options.withTest) {
      template = template.replace(` data-testid="TemplateName"`, '');
    }

    // if it has a corresponding stylesheet
    if (options.withStyle) {
      const module = usesCssModule ? '.module' : '';
      const cssPath = `${itemName}${module}.${cssPreprocessor}`;

      // if the css module is true make sure to update the template accordingly
      if (module.length) {
        template = template.replace(`'./TemplateName.module.css'`, `'./${cssPath}'`);
      } else {
        template = template.replace(`{styles.TemplateName}`, `"${itemName}"`);
        template = template.replace(`styles from './TemplateName.module.css'`, `'./${cssPath}'`);
      }
    } else {
      // if there is no stylesheet, remove `className` attribute and style import from `jsTemplate`
      template = template.replace(` className={styles.TemplateName}`, '');
      template = template.replace(`import styles from './TemplateName.module.css';`, '');
    }
  }

  return {
    filename,
    template,
    itemPath: `${options.path}${options.flat ? '' : `/${itemName}`}/${filename}`,
  };
}

/**
 * Component style template generator.
 * If `customTemplates` key defined in CLI config file, then the returned object will be related to that `customTemplates`.
 */
function componentStyleTemplateGenerator({ itemName, cliConfigFile, options }: GenerateComponentParams) {
  const { cssPreprocessor, usesCssModule } = cliConfigFile;
  // @ts-ignore
  const { customTemplates } = cliConfigFile.component[options.type] as RegenComponentTypeCustom;
  let template = null;
  let filename = null;

  // check for a custom style template
  if (customTemplates && customTemplates.style) {
    // load and use the custom style template
    const { template: customTemplate, filename: customTemplateFilename } = getItemCustomTemplate(
      itemName,
      customTemplates.style
    );

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    const module = usesCssModule ? '.module' : '';
    const cssFilename = `${itemName}${module}.${cssPreprocessor}`;

    // else, use built-in style template
    template = componentCssTemplate;
    filename = cssFilename;
  }

  return {
    filename,
    template,
    itemPath: `${options.path}${options.flat ? '' : `/${itemName}`}/${filename}`,
  };
}

/**
 * Component test template generator.
 * If `customTemplates` key defined in CLI config file, then the returned object will be related to that `customTemplates`.
 */
function componentTestTemplateGenerator({ itemName, cliConfigFile, options }: GenerateComponentParams) {
  const { testLibrary, usesTypeScript } = cliConfigFile;
  // @ts-ignore
  const { customTemplates } = cliConfigFile.component[options.type] as RegenComponentTypeCustom;
  let template = null;
  let filename = null;

  // check for a custom test template
  if (customTemplates && customTemplates.test) {
    // load and use the custom test template
    const { template: customTemplate, filename: customTemplateFilename } = getItemCustomTemplate(
      itemName,
      customTemplates.test
    );

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    filename = usesTypeScript ? `${itemName}.test.tsx` : `${itemName}.test.js`;

    if (testLibrary === 'Enzyme') {
      template = componentTestEnzymeTemplate;
    } else if (testLibrary === 'Testing Library') {
      template = componentTestTestingLibraryTemplate;
    } else {
      template = componentTestDefaultTemplate;
    }
  }

  return {
    filename,
    template,
    itemPath: `${options.path}${options.flat ? '' : `/${itemName}`}/${filename}`,
  };
}

/**
 * Component story template generator.
 * If `customTemplates` key defined in CLI config file, then the returned object will be related to that `customTemplates`.
 */
function componentStoryTemplateGenerator({ itemName, cliConfigFile, options }: GenerateComponentParams) {
  const { usesTypeScript } = cliConfigFile;
  // @ts-ignore
  const { customTemplates } = cliConfigFile.component[options.type] as RegenComponentTypeCustom;
  let template = null;
  let filename = null;

  // check for a custom story template
  if (customTemplates && customTemplates.story) {
    // load and use the custom story template
    const { template: customTemplate, filename: customTemplateFilename } = getItemCustomTemplate(
      itemName,
      customTemplates.story
    );

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    // else, use built-in story template
    template = componentStoryTemplate;
    filename = usesTypeScript ? `${itemName}.stories.tsx` : `${itemName}.stories.js`;
  }

  return {
    filename,
    template,
    itemPath: `${options.path}${options.flat ? '' : `/${itemName}`}/${filename}`,
  };
}

/**
 * Lazy loaded component template generator.
 * If `customTemplates` key defined in CLI config file, then the returned object will be related to that `customTemplates`.
 */
function componentLazyTemplateGenerator({ itemName, cliConfigFile, options }: GenerateComponentParams) {
  const { usesTypeScript } = cliConfigFile;
  // @ts-ignore
  const { customTemplates } = cliConfigFile.component[options.type] as RegenComponentTypeCustom;
  let template = null;
  let filename = null;

  // check for a custom lazy template
  if (customTemplates && customTemplates.lazy) {
    // load and use the custom lazy template
    const { template: customTemplate, filename: customTemplateFilename } = getItemCustomTemplate(
      itemName,
      customTemplates.lazy
    );

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    // else, use built-in lazy template
    template = usesTypeScript ? componentTsLazyTemplate : componentLazyTemplate;
    filename = usesTypeScript ? `${itemName}.lazy.tsx` : `${itemName}.lazy.js`;
  }

  return {
    filename,
    template,
    itemPath: `${options.path}${options.flat ? '' : `/${itemName}`}/${filename}`,
  };
}

// built-in component file types
const builtInComponentFileTypes = {
  COMPONENT: 'component', // always executed, except if the component already exist in the path directory
  STYLE: 'withStyle',
  TEST: 'withTest',
  LAZY: 'withLazy',
  STORY: 'withStory',
};

// generate component template map
const componentTemplateGeneratorMap = {
  [builtInComponentFileTypes.COMPONENT]: componentTemplateGenerator, // always executed, except if the component already exist in the path directory
  [builtInComponentFileTypes.STYLE]: componentStyleTemplateGenerator,
  [builtInComponentFileTypes.TEST]: componentTestTemplateGenerator,
  [builtInComponentFileTypes.LAZY]: componentLazyTemplateGenerator,
  [builtInComponentFileTypes.STORY]: componentStoryTemplateGenerator,
};

/**
 * Generate component based on user inputs & CLI config file.
 */
export default function generateComponent({ itemName, cliConfigFile, options }: GenerateComponentParams) {
  const spinner = preGenerate({ options });

  // get default component file types
  const componentFileTypes = ['component', ...getItemFileTypes(options)];

  componentFileTypes.forEach((fileType) => {
    // generate templates only if the component options (e.g. withStyle, withTest, etc..) are true OR if the template type is "component"
    if (
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      (options[fileType] && options[fileType].toString() === 'true') ||
      fileType === builtInComponentFileTypes.COMPONENT
    ) {
      // start loading spinner
      spinner.start(chalk.cyan(`Generating component...`));

      // get correct `generateTemplate` function based on the `fileType`
      const generateTemplate = componentTemplateGeneratorMap[fileType] || customFileTemplateGenerator;

      // run the `generateTemplate` function
      const { itemPath, filename, template } = generateTemplate({
        // @ts-ignore
        fileType,
        item: 'component',
        itemName,
        cliConfigFile,
        options,
      });

      // make sure the component does not already exist in the path directory.
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

        // generate component with OpenAI, if component description is provided
        if (options.describe && fileType === builtInComponentFileTypes.COMPONENT) {
          aiItemTemplateGenerator({
            item: 'component',
            isTest: false,
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
                  )} component with the provided description`
                )
              );
            })
            .catch((error) =>
              spinner.fail(
                chalk.red(
                  `OpenAI failed to create the ${chalk.bold.italic.red(
                    `"${filename}"`
                  )} component with the provided description`,
                  error
                )
              )
            );

          return;
        }

        // generate component unit tests with OpenAI, if component description is provided
        if (options.describe && fileType === builtInComponentFileTypes.TEST) {
          aiItemTemplateGenerator({
            item: 'component',
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
                  )} component unit tests with the provided description`
                )
              );
            })
            .catch((error) =>
              spinner.fail(
                chalk.red(
                  `OpenAI failed to create the ${chalk.bold.italic.red(
                    `"${filename}"`
                  )} component unit tests with the provided description`,
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
