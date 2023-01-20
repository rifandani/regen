import type { Command } from 'commander';
import { ScaffoldCommandOptions } from '../types/command.type';
import { RegenConfig } from '../types/config.type';

import generateScaffold from '../utils/generateScaffold.util';

/**
 * Init the "scaffold" command.
 *
 * @param {configObject} cliConfigFile returned object from `getCLIConfigFile()` function
 */
export default function initGenerateScaffoldCommand(cliConfigFile: RegenConfig, program: Command) {
  // main scaffold program
  const scaffoldCommand = program
    .command('scaffold')
    .description('Init a new project based on a given url.')
    .argument('[url]', 'a url in which will be used to scaffold a new project')
    .alias('sc')
    .option('-t, --type <type>', 'The "scaffold" key/type that you have configured in your config file', 'default')
    .option('-dr, --dry-run', 'Show what will be generated without writing to disk')
    .option('-D, --debug', 'Output extra debugging data');

  // scaffold command action
  scaffoldCommand.action((url: string, options: ScaffoldCommandOptions) =>
    generateScaffold({ url, cliConfigFile, options })
  );
}
