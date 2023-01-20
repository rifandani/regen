import type { Command } from 'commander';
import { Except } from 'type-fest';

import { HookCommandOptions } from '../types/command.type';
import { RegenConfig, RegenHookTypeCustom, RegenHookTypeNormal } from '../types/config.type';
import { getItemByType, getItemFileTypes } from '../utils/commonGenerate.util';
import generateHook from '../utils/generateHook.util';

/**
 * Init the "hook" command.
 *
 * @param {configObject} cliConfigFile returned object from `getCLIConfigFile()` function
 */
export default function initGenerateHookCommand(
  args: NodeJS.Process['argv'],
  cliConfigFile: RegenConfig,
  program: Command
) {
  // get hook type from CLI config file
  const selectedHookType = getItemByType('hook', args, cliConfigFile) as RegenHookTypeNormal | RegenHookTypeCustom;

  // main hook program
  const hookCommand = program
    .command('hook')
    .description('Creates a new, generic hook definition in the given or default project.')
    .argument('<name...>', 'list of hook name to be generated')
    .alias('h')
    .option('-p, --path <path>', 'The path where the hook will be generated', selectedHookType.path)
    .option('-t, --type <type>', 'The "hook" key/type that you have configured in your config file', 'default')
    .option(
      '-d, --describe <describe>',
      'The description of the hook you want to generate (e.g. A hook that returns the latest value, effectively avoiding the closure problem)',
      undefined
    )
    .option('-f, --flat', 'Generate the files in the mentioned path insted of creating new folder for it')
    .option('-dr, --dry-run', 'Show what will be generated without writing to disk')
    .option('-D, --debug', 'Output extra debugging data');

  // get default hook file types
  const fileTypes = getItemFileTypes(selectedHookType);

  // add more command options dynamically (e.g ['withTest'])
  fileTypes.forEach((fileType) => {
    hookCommand.option(
      `--${fileType} <${fileType}>`,
      `With corresponding ${fileType.split('with')[1]} file.`,
      selectedHookType[fileType as unknown as keyof Except<RegenHookTypeCustom, 'customTemplates'>]
    );
  });

  // hook command action
  hookCommand.action((hookNames: string[], options: HookCommandOptions) =>
    hookNames.forEach((itemName) => generateHook({ itemName, cliConfigFile, options }))
  );
}
