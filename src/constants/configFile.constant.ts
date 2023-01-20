import type { Answers, QuestionCollection } from 'inquirer';

// QuestionCollection<Answers> === Parameters<typeof prompt>[0]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConfigQuestions = QuestionCollection<Answers> & { [Symbol.iterator](): any };

// project level questions
export const projectLevelQuestions: ConfigQuestions = [
  {
    type: 'confirm',
    name: 'usesTypeScript',
    message: 'Does this project use TypeScript?',
    default: () => true,
  },
  {
    type: 'confirm',
    name: 'usesCssModule',
    message: 'Does this project use CSS modules?',
  },
  {
    type: 'list',
    name: 'cssPreprocessor',
    message: 'Does this project use a CSS Preprocessor?',
    choices: ['css', 'scss', 'less', 'styl'],
  },
  {
    type: 'list',
    name: 'testLibrary',
    message: 'What testing library does your project use?',
    choices: ['Testing Library', 'Enzyme', 'None'],
  },
];

// component level questions
export const componentLevelQuestions: ConfigQuestions = [
  {
    type: 'input',
    name: 'component.default.path',
    message: 'Set the default path directory to where your components will be generated in?',
    default: () => 'src/components',
  },
  {
    type: 'confirm',
    name: 'component.default.withStyle',
    message: 'Would you like to create a corresponding stylesheet file with each component you generate?',
  },
  {
    type: 'confirm',
    name: 'component.default.withTest',
    message: 'Would you like to create a corresponding test file with each component you generate?',
  },
  {
    type: 'confirm',
    name: 'component.default.withStory',
    message: 'Would you like to create a corresponding story with each component you generate?',
  },
  {
    type: 'confirm',
    name: 'component.default.withLazy',
    message:
      'Would you like to create a corresponding lazy file (a file that lazy-loads your component out of the box and enables code splitting: https://reactjs.org/docs/code-splitting.html#code-splitting) with each component you generate?',
  },
];

// hook level questions
export const hookLevelQuestions: ConfigQuestions = [
  {
    type: 'input',
    name: 'hook.default.path',
    message: 'Set the default path directory to where your hooks will be generated in?',
    default: () => 'src/hooks',
  },
  {
    type: 'confirm',
    name: 'hook.default.withTest',
    message: 'Would you like to create a corresponding test file with each hook you generate?',
  },
];

// view level questions
export const viewLevelQuestions: ConfigQuestions = [
  {
    type: 'input',
    name: 'view.default.path',
    message: 'Set the default path directory to where your views will be generated in?',
    default: () => 'src/views',
  },
  {
    type: 'confirm',
    name: 'view.default.withRoute',
    message: 'Would you like to create a corresponding route file with each view component you generate?',
    default: () => true,
  },
  {
    type: 'confirm',
    name: 'view.default.withViewModel',
    message: 'Would you like to create a corresponding view model file with each view component you generate?',
    default: () => true,
  },
  {
    type: 'confirm',
    name: 'view.default.withTest',
    message: 'Would you like to create a corresponding test file with each view component you generate?',
  },
];

// store level questions
export const storeLevelQuestions: ConfigQuestions = [
  {
    type: 'input',
    name: 'store.default.path',
    message: 'Set the default path directory to where your stores will be generated in?',
    default: () => 'src/stores',
  },
  {
    type: 'confirm',
    name: 'store.default.useEntityAdapter',
    message: 'Would you rather normalize your state shape using entity adapter for each store you generate?',
  },
  {
    type: 'confirm',
    name: 'store.default.withTest',
    message: 'Would you like to create a corresponding test file with each store you generate?',
  },
];

// scaffold level questions
export const scaffoldLevelQuestions: ConfigQuestions = [
  {
    type: 'input',
    name: 'scaffold.default.url',
    message: 'Set the url to where we point your default scaffolds?',
    default: () => 'https://github.com/rifandani/frontend-template-rest.git',
  },
];

// merge all questions together
export const configQuestions = [
  ...projectLevelQuestions,
  ...componentLevelQuestions,
  ...hookLevelQuestions,
  ...viewLevelQuestions,
  ...storeLevelQuestions,
  ...scaffoldLevelQuestions,
];
