import cfonts from 'cfonts';
import chalk from 'chalk';
import deepKeys from 'deep-keys';
import fsExtra from 'fs-extra';
import inquirer, { Question } from 'inquirer';
import { merge } from 'lodash';

import { configQuestions } from '../constants/configFile.constant';

const { accessSync, constants, outputFileSync, readFileSync } = fsExtra;
const { prompt } = inquirer;

/**
 * Render cool fonts using `cfonts`
 */
function renderCoolFont(text: string) {
  cfonts.say(text, {
    font: 'block',
    colors: ['cyan', 'yellow'],
    letterSpacing: 2,
    lineHeight: 0.1,
    space: true,
    gradient: true,
    independentGradient: true,
    transitionGradient: true,
  });
}

/**
 * Console log prompt for create config CLI
 */
function consolePromptCreateConfigCLI() {
  renderCoolFont('REGEN');
  console.log(
    chalk.cyan('-----------------------------------------------------------------------------------------------------')
  );
  console.log(
    chalk.cyan(
      `It looks like this is the first time that you're running ${chalk.bold.italic.cyan('regen')} within this project.`
    )
  );
  console.log();
  console.log(
    chalk.cyan(
      `Answer a few questions to customize ${chalk.bold.italic.cyan(
        'regen'
      )} for your project needs. \n(this will create a ${chalk.bold.italic.cyan(
        '"regen.json"'
      )} config file on the root level of this project)`
    )
  );
  console.log(
    chalk.cyan('-----------------------------------------------------------------------------------------------------')
  );
  console.log();
}

/**
 * Console log success for create config CLI
 */
function consoleSuccessCreateConfigCLI() {
  console.log();
  console.log(
    chalk.cyan(
      `The ${chalk.bold.italic.cyan(
        '"regen.json"'
      )} config file has been successfully created on the root level of your project.`
    )
  );
  console.log('');
  console.log(chalk.cyan('You can always go back and update it as needed.'));
  console.log('');
  console.log(chalk.cyan('Happy Hacking!'));
  console.log('');
  console.log('');
}

/**
 * Console log prompt for update config CLI
 */
function consolePromptUpdateCLI() {
  renderCoolFont('REGEN');
  console.log(
    chalk.cyan('-----------------------------------------------------------------------------------------------------')
  );
  console.log(chalk.cyan('Your config file has been outdated from the last time you ran it within this project.'));
  console.log();
  console.log(
    chalk.cyan(`Please answer a few questions to update the ${chalk.bold.italic.cyan('"regen.json"')} config file.`)
  );
  console.log(
    chalk.cyan('-----------------------------------------------------------------------------------------------------')
  );
  console.log();
}

/**
 * Console log success for update config CLI
 */
function consoleSuccessUpdateConfigCLI() {
  console.log();
  console.log(
    chalk.cyan(`The ${chalk.bold.italic.cyan('"regen.json"')} config file has successfully updated for this project.`)
  );
  console.log();
  console.log(chalk.cyan('You can always go back and manually update it as needed.'));
  console.log();
  console.log(chalk.cyan('Happy Hacking!'));
  console.log();
  console.log();
}

/**
 * Create "regen.json" config file on the root level of this project for the first time user.
 * returns:  `answers` config object from `await prompt(configQuestions)` which will be outputed to config JSON file OR error object.
 */
async function createCLIConfigFile() {
  consolePromptCreateConfigCLI();

  try {
    // prompt the user
    const answers = (await prompt(configQuestions)) as Record<string, unknown>;

    // create the config JSON file
    outputFileSync('regen.json', JSON.stringify(answers, null, 2));

    consoleSuccessCreateConfigCLI();

    return answers;
  } catch (e) {
    console.error(chalk.red(`ERROR: Could not create a ${chalk.bold.italic.red('"regen.json"')} config file.`));
    return e;
  }
}

/**
 * Update existing CLI config file.
 * returns: `updatedAnswers` config object from `await prompt(missingConfigQuestions)` which will be outputed to config JSON file OR error object
 */
async function updateCLIConfigFile(missingConfigQuestions: unknown[], currentConfigFile: Record<string, unknown>) {
  consolePromptUpdateCLI();

  try {
    // prompt the user
    const answers = (await prompt(missingConfigQuestions)) as Record<string, unknown>;

    // merge current config with the new config returned from prompt
    const updatedAnswers = merge({}, currentConfigFile, answers);

    // create the config JSON file
    outputFileSync('regen.json', JSON.stringify(updatedAnswers, null, 2));

    consoleSuccessUpdateConfigCLI();

    return updatedAnswers;
  } catch (e) {
    console.error(chalk.red(`ERROR: Could not update the ${chalk.bold.italic.red('"regen.json"')} config file.`));
    return e;
  }
}

/**
 * Get defined "regen.json" config file from the root level of project.
 * If there is none, then it will create a new one.
 * Make sure the CLI commands are running from the root level of the project.
 */
export default async function getCLIConfigFile() {
  try {
    // check if the program currently runs on the root project
    accessSync('./package.json', constants.R_OK);

    try {
      // check to see if the config file exists and parse the config JSON file to object
      accessSync('./regen.json', constants.R_OK);
      const currentConfigFile = JSON.parse(readFileSync('./regen.json').toString()) as Record<string, unknown>; // RegenConfig

      // check to see if there's a difference between `configQuestions` and the `currentConfigFile`.
      const missingConfigQuestions = configQuestions.filter(
        (question) => !deepKeys(currentConfigFile).includes((question as Question).name as string)
      );

      if (missingConfigQuestions.length) {
        // if there is, update the `currentConfigFile` with the `missingConfigQuestions`.
        return await updateCLIConfigFile(missingConfigQuestions, currentConfigFile);
      }

      // if there is no difference, then just returns `currentConfigFile` object
      return currentConfigFile;
    } catch (e) {
      // if config JSON file doesn't exists, create a new one
      return await createCLIConfigFile();
    }
  } catch (error) {
    console.error(
      chalk.red(
        `ERROR: Please make sure that you're running the ${chalk.bold.italic.red(
          '"regen"'
        )} commands from the root level of your React project`
      )
    );

    // exit program
    return process.exit(1);
  }
}
