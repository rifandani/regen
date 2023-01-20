/* eslint-disable @typescript-eslint/ban-ts-comment */
import chalk from 'chalk';
import { exec } from 'child_process';
import type { Ora } from 'ora';
import { promisify } from 'util';

import type { GenerateScaffoldParams } from '../types/generateScaffold.type.js';
import { preGenerate } from './commonGenerate.util.js';

const execAsync = promisify(exec);

/**
 * Get a repo name from input user `url` or config file `cliConfigFile.scaffold.default.url`
 */
function getRepoNameFromUrl(url: string) {
  const splittedUrl = url.split('/');
  const repoName = splittedUrl[splittedUrl.length - 1].split('.')[0];

  return repoName;
}

/**
 * Common loading toast
 */
function toastLoading(spinner: Ora, repoName: string | undefined) {
  spinner.start(
    chalk.cyan(`Scaffolding project ${repoName ? chalk.bold.italic.cyan(`"${repoName}"`) : ''}. Please wait...\n`)
  );
}

/**
 * Common success toast
 */
function toastSuccess(spinner: Ora, repoName: string | undefined) {
  spinner.succeed(
    chalk.green(`Scaffolding project${repoName ? chalk.bold.italic.green(` "${repoName}"`) : ''} success.`)
  );
  if (repoName)
    console.log(
      chalk.cyan(
        `👌 You can access the project by typing ${chalk.bold.italic.cyan(
          `"cd ${repoName}"`
        )} in the root level of your project.`
      )
    );
}

/**
 * Common warning toast
 */
function toastWarning(spinner: Ora, firstArg: string, secondArg: string) {
  spinner.warn(
    `Please make sure ${chalk.bold.italic.yellow(
      `"${firstArg}"`
    )} you're trying to use exists in the ${chalk.bold.italic.yellow(
      'regen.json'
    )} config file under the ${chalk.bold.italic.yellow(`"${secondArg}"`)} object`
  );
}

/**
 * Common logic for scaffolding project
 */
async function executeScaffolding(
  isDryRun: boolean,
  spinner: Ora,
  url: string | undefined,
  customCommand: string | undefined
) {
  // get repo name from `url`
  let repoName;
  if (url) repoName = getRepoNameFromUrl(url);

  // execute "git clone"
  toastLoading(spinner, repoName);

  if (customCommand && !isDryRun) await execAsync(customCommand);
  else if (url && !isDryRun) await execAsync(`git clone ${url}`);

  // success toast
  toastSuccess(spinner, repoName);
}

/**
 * Generate scaffold based on user inputs & CLI config file.
 */
export default async function generateScaffold({ url, cliConfigFile, options }: GenerateScaffoldParams) {
  const spinner = preGenerate({ options });

  try {
    if (url) {
      // execute command
      await executeScaffolding(options.dryRun, spinner, url, undefined);
      return;
    }

    if (options.type) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!cliConfigFile.scaffold[options.type]) {
        // warn toast and exit
        toastWarning(spinner, options.type, 'scaffold');
        return;
      }

      // @ts-ignore
      if (cliConfigFile.scaffold[options.type].url) {
        // execute command
        await executeScaffolding(
          options.dryRun,
          spinner,
          // @ts-ignore
          cliConfigFile.scaffold[options.type].url as string,
          undefined
        );
        // @ts-ignore
      } else if (cliConfigFile.scaffold[options.type].command) {
        // execute custom command
        await executeScaffolding(
          options.dryRun,
          spinner,
          undefined,
          // @ts-ignore
          cliConfigFile.scaffold[options.type].command as string
        );
      } else {
        // warn toast and exit
        spinner.warn(
          `Please make sure ${chalk.bold.italic.yellow(
            `"${options.type}"`
          )} you're trying to use is supported by ${chalk.bold.italic.yellow(
            'regen'
          )}. Please check ${chalk.bold.italic.yellow(
            `https://www.npmjs.com/package/@rifandani/regen`
          )} for further informations.`
        );
      }

      return;
    }

    if (!url) {
      if (!cliConfigFile.scaffold.default) {
        // warn toast and exit
        toastWarning(spinner, 'default', 'scaffold');
        return;
      }

      // @ts-ignore
      if (!cliConfigFile.scaffold.default.url) {
        // warn toast and exit
        toastWarning(spinner, 'url', 'scaffold.default');
        return;
      }

      // execute command
      // @ts-ignore
      await executeScaffolding(options.dryRun, spinner, cliConfigFile.scaffold.default.url as string, undefined);
    }
  } catch (error) {
    spinner.fail(chalk.red(`❌ Scaffolding failed`));
    console.error(error);
  }

  // if user inputs option `dryRun`
  if (options.dryRun) {
    console.log();
    spinner.warn(chalk.yellow(`NOTE: The ${chalk.bold.italic.yellow('"dry-run"')} flag means no changes were made`));
    console.log();
  }
}
