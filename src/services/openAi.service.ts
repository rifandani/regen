import { Configuration, OpenAIApi } from 'openai';

type AiTemplateGeneratorParams = {
  item: string;
  isTest: boolean;
  itemTemplate: string;
  instructions: string;
};

/**
 * Initialize an AI-generated "component" / "hook" template.
 * params `item` is a placeholder that could be replaced by "component" / "hook"
 * params `isTest` is a prompt for unit tests
 * params `itemTemplate` is item template in string
 * params `instructions` is from user input option `describe`
 *
 * @returns AI-generated "component" / "hook" template
 */
export default async function aiItemTemplateGenerator({
  item,
  isTest = false,
  itemTemplate,
  instructions,
}: AiTemplateGeneratorParams) {
  const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  const openAiApi = new OpenAIApi(configuration);

  const generatedComponent = await openAiApi.createCompletion({
    model: 'text-davinci-003',
    prompt: `Create a React ${item} ${
      isTest ? 'unit tests' : ''
    } using this template "${itemTemplate}", but make the adjustments needed with these instructions as follows "${instructions}"`,
    temperature: 0.7,
    max_tokens: 2000,
    frequency_penalty: 0.0,
    presence_penalty: 1,
  });

  return generatedComponent.data.choices[0].text;
}
