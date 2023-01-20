import type { Command } from 'commander';
import type { Except } from 'type-fest';

import type { StoreCommandOptions } from '../types/command.type';
import type { RegenConfig, RegenStoreTypeCustom, RegenStoreTypeNormal } from '../types/config.type';
import { getItemByType, getItemFileTypes } from '../utils/commonGenerate.util';
import generateStore from '../utils/generateStore.util';

/**
 * Init the "store" command.
 *
 * @param {process.argv} args get from `process.argv`
 * @param {configObject} cliConfigFile returned object from `getCLIConfigFile()` function
 * @param {Command} program imported from `commander.program`
 */
export default function initGenerateStoreCommand(
  args: NodeJS.Process['argv'],
  cliConfigFile: RegenConfig,
  program: Command
) {
  // get "store" type from CLI config file
  const selectedStoreType = getItemByType('store', args, cliConfigFile) as RegenStoreTypeNormal | RegenStoreTypeCustom;

  // main "store" program
  const storeCommand = program
    .command('store')
    .description('Creates a new, generic "store" definition in the given or default project.')
    .argument('<name...>', 'list of "store" name to be generated')
    .alias('st')
    .option('-p, --path <path>', 'The path where the "store" will be generated', selectedStoreType.path)
    .option('-t, --type <type>', 'The "store" key/type that you have configured in your config file', 'default')
    .option('--useEntityAdapter', 'Normalize your state shape using entity adapter for each store generated', false)
    .option('-f, --flat', 'Generate the files in the mentioned path insted of creating new folder for it')
    .option('-dr, --dry-run', 'Show what will be generated without writing to disk')
    .option('-D, --debug', 'Output extra debugging data');

  // get default store file types
  const fileTypes = getItemFileTypes(selectedStoreType);

  // add more command options dynamically (e.g ['withTest'])
  fileTypes.forEach((fileType) => {
    storeCommand.option(
      `--${fileType} <${fileType}>`,
      `With corresponding ${fileType.split('with')[1]} file.`,
      selectedStoreType[fileType as unknown as keyof Except<RegenStoreTypeCustom, 'customTemplates'>]
    );
  });

  // store command action
  storeCommand.action((storeNames: string[], options: StoreCommandOptions) =>
    storeNames.forEach((itemName) => generateStore({ itemName, cliConfigFile, options }))
  );
}
