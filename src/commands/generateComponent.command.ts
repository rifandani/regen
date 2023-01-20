import type { Command } from 'commander';
import { Except } from 'type-fest';

import type { ComponentCommandOptions } from '../types/command.type';
import type { RegenComponentTypeCustom, RegenComponentTypeNormal, RegenConfig } from '../types/config.type';
import { getItemByType, getItemFileTypes } from '../utils/commonGenerate.util';
import generateComponent from '../utils/generateComponent.util';

/**
 * Init the "component" command.
 *
 * @param {configObject} cliConfigFile returned object from `getCLIConfigFile()` function
 */
export default function initGenerateComponentCommand(
  args: NodeJS.Process['argv'],
  cliConfigFile: RegenConfig,
  program: Command
) {
  // get component type from CLI config file
  const selectedComponentType = getItemByType('component', args, cliConfigFile) as
    | RegenComponentTypeNormal
    | RegenComponentTypeCustom;

  // main component program
  const componentCommand = program
    .command('component')
    .description('Creates a new, generic component definition in the given or default project.')
    .argument('<name...>', 'list of component name to be generated')
    .alias('c')
    .option('-p, --path <path>', 'The path where the component will be generated', selectedComponentType.path)
    .option('-t, --type <type>', 'The "component" key/type that you have configured in your config file', 'default')
    .option(
      '-d, --describe <describe>',
      'The description of the component you want to generate (e.g. Create a counter component that increments by one when I click on the increment button)',
      undefined
    )
    .option('-f, --flat', 'Generate the files in the mentioned path insted of creating new folder for it')
    .option('-dr, --dry-run', 'Show what will be generated without writing to disk')
    .option('-D, --debug', 'Output extra debugging data');

  // get default component file types
  const fileTypes = getItemFileTypes(selectedComponentType);

  // add more command options dynamically (e.g ['withStyle', 'withTest', 'withStory', 'withLazy'])
  fileTypes.forEach((fileType) => {
    componentCommand.option(
      `--${fileType} <${fileType}>`,
      `With corresponding ${fileType.split('with')[1]} file.`,
      selectedComponentType[fileType as unknown as keyof Except<RegenComponentTypeCustom, 'customTemplates'>]
    );
  });

  // component command action
  componentCommand.action((componentNames: string[], options: ComponentCommandOptions) =>
    componentNames.forEach((itemName) => generateComponent({ itemName, cliConfigFile, options }))
  );
}
