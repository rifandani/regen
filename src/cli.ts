import { program } from 'commander';
import { config as dotEnvConfig } from 'dotenv';
import fsExtra from 'fs-extra';
import type { PackageJson } from 'type-fest';

import initGenerateComponentCommand from './commands/generateComponent.command';
import initGenerateHookCommand from './commands/generateHook.command';
import initGenerateScaffoldCommand from './commands/generateScaffold.command';
import initGenerateStoreCommand from './commands/generateStore.command';
import initGenerateViewCommand from './commands/generateView.command';
import type { RegenConfig } from './types/config.type';
import getCLIConfigFile from './utils/configFile.util';

const { readFileSync } = fsExtra;

/**
 * Setup / init Regen CLI program.
 */
export default async function cli(args: NodeJS.Process['argv']) {
  try {
    // get config file object
    const cliConfigFile = (await getCLIConfigFile()) as RegenConfig;

    // require package.json
    const pkg = JSON.parse(readFileSync('./package.json').toString()) as PackageJson;

    // init dotenv, currently used for OpenAI
    dotEnvConfig();

    // init "generate component" command
    initGenerateComponentCommand(args, cliConfigFile, program);
    // init "generate hook" command
    initGenerateHookCommand(args, cliConfigFile, program);
    // init "generate view" command
    initGenerateViewCommand(args, cliConfigFile, program);
    // init "generate store" command
    initGenerateStoreCommand(args, cliConfigFile, program);
    // init "generate scaffold" command
    initGenerateScaffoldCommand(cliConfigFile, program);

    // init library additional info
    program.name('regen');
    program.description(pkg.description as string);
    program.version(pkg.version as string);

    // parse the user inputs
    program.parse(args);
  } catch (err) {
    console.error(err);
  }
}
