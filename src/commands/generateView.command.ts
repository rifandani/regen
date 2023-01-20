import type { Command } from 'commander';
import type { Except } from 'type-fest';
import { ViewCommandOptions } from '../types/command.type';

import type { RegenConfig, RegenViewTypeCustom, RegenViewTypeNormal } from '../types/config.type';
import { getItemByType, getItemFileTypes } from '../utils/commonGenerate.util';
import generateView from '../utils/generateView.util';

/**
 * Init the "view" command.
 *
 * @param {configObject} cliConfigFile returned object from `getCLIConfigFile()` function
 */
export default function initGenerateViewCommand(
  args: NodeJS.Process['argv'],
  cliConfigFile: RegenConfig,
  program: Command
) {
  // get view type from CLI config file
  const selectedViewType = getItemByType('view', args, cliConfigFile) as RegenViewTypeNormal | RegenViewTypeCustom;

  // main view program
  const viewCommand = program
    .command('view')
    .description('Creates a new, generic view definition in the given or default project.')
    .argument('<name...>', 'list of view name to be generated')
    .alias('v')
    .option('-p, --path <path>', 'The path where the view will be generated', selectedViewType.path)
    .option('-t, --type <type>', 'The "view" key/type that you have configured in your config file', 'default')
    .option('-f, --flat', 'Generate the files in the mentioned path insted of creating new folder for it')
    .option('-dr, --dry-run', 'Show what will be generated without writing to disk')
    .option('-D, --debug', 'Output extra debugging data');

  // get default view file types
  const fileTypes = getItemFileTypes(selectedViewType);

  // add more command options dynamically (e.g ['withTest'])
  fileTypes.forEach((fileType) => {
    viewCommand.option(
      `--${fileType} <${fileType}>`,
      `With corresponding ${fileType.split('with')[1]} file.`,
      selectedViewType[fileType as unknown as keyof Except<RegenViewTypeCustom, 'customTemplates'>]
    );
  });

  // view command action
  viewCommand.action((viewNames: string[], options: ViewCommandOptions) =>
    viewNames.forEach((itemName) => generateView({ itemName, cliConfigFile, options }))
  );
}
