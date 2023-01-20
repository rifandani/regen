import { AsyncReturnType } from 'type-fest';

/**
 * A helper to check if input value is a number.
 */
// input value could be any type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNumber(value: any): value is number {
  try {
    return Number(value) === value;
  } catch {
    return false;
  }
}

/**
 * A helper to check if input value is an integer number.
 */
// input value could be any type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isInt(value: any): value is number {
  return isNumber(value) && value % 1 === 0;
}

/**
 * A helper to check if input value is a float number.
 */
// input value could be any type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isFloat(value: any): value is number {
  return isNumber(value) && value % 1 !== 0;
}

/**
 * A helper to check if input value is a function.
 */
export function isFunction<T>(value: T): boolean {
  return Object.prototype.toString.call(value) === '[object Function]';
}

/**
 * A helper to check if input value is a date.
 */
export function isDate<T>(value: T): boolean {
  return Object.prototype.toString.call(value) === '[object Date]';
}

export function isObject(value: unknown): value is object {
  return value !== null && typeof value === 'object' && !(value instanceof Date);
}

/**
 * A helper to try an async function without forking the control flow with "try catch".
 * Returns an error first callback _like_ array response as [Error, result].
 *
 * @example
 *
 * ```ts
 * const [userError, user] = await tryAsync(api.users.find)(userId)
 * ```
 */
// The parameter & return type for the input function can be anything
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function tryAsync<TFunction extends (...args: any[]) => any>(func: TFunction) {
  return async (
    ...args: Parameters<TFunction>
  ): Promise<[undefined, AsyncReturnType<ReturnType<TFunction>>] | [Error, undefined]> => {
    try {
      return [undefined, await func(...args)];
    } catch (err) {
      // Again, we don't know the type for the error output from async function
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return [err as any, undefined];
    }
  };
}

/**
 * Capitalize the first word of the string
 *
 * @example
 *
 * ```ts
 * capitalize('hello') // 'Hello'
 * capitalize('va va voom') // 'Va va voom'
 * ```
 */
export function capitalize(str: string): string {
  if (!str || str.length === 0) return '';
  const lower = str.toLowerCase();
  return lower.substring(0, 1).toUpperCase() + lower.substring(1, lower.length);
}

/**
 * Formats the given string in camel case fashion
 *
 * @example
 *
 * ```ts
 * toCamelCase('hello world') // 'helloWorld'
 * toCamelCase('va va-VOOM') // 'vaVaVoom'
 * toCamelCase('HelloWorld') // 'helloWorld'
 * toCamelCase('helloWorld') // 'helloWorld'
 * ```
 */
export function toCamelCase(str: string): string {
  const parts =
    str
      ?.trim()
      ?.replace(/([A-Z])+/g, capitalize)
      .split(/(?=[A-Z])|[.\-\s_]/)
      .map((x) => x.toLowerCase()) ?? [];
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];

  return parts.reduce((acc, part) => `${acc}${part.charAt(0).toUpperCase()}${part.slice(1)}`);
}

/**
 * Formats the given string in snake case fashion
 *
 * @example
 *
 * ```ts
 * toSnakeCase('hello world') // 'hello_world'
 * toSnakeCase('va va-VOOM') // 'va_va_voom'
 * toSnakeCase('helloWord') // 'hello_world'
 * ```
 */
export function toSnakeCase(str: string): string {
  const parts =
    str
      ?.trim()
      ?.replace(/([A-Z])+/g, capitalize)
      .split(/(?=[A-Z])|[.\-\s_]/)
      .map((x) => x.toLowerCase()) ?? [];
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];

  return parts.reduce((acc, part) => `${acc}_${part.toLowerCase()}`);
}

/**
 * Formats the given string in kebab case fashion
 *
 * @example
 *
 * ```ts
 * toKebabCase('hello world') // 'hello-world'
 * toKebabCase('va va_VOOM') // 'va-va-voom'
 * toKebabCase('helloWord') // 'hello-word'
 * ```
 */
export function toKebabCase(str: string): string {
  const parts =
    str
      ?.trim()
      ?.replace(/([A-Z])+/g, capitalize)
      .split(/(?=[A-Z])|[.\-\s_]/)
      .map((x) => x.toLowerCase()) ?? [];
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];

  return parts.reduce((acc, part) => `${acc}-${part.toLowerCase()}`);
}

/**
 * Formats the given string in pascal case fashion
 *
 * @example
 *
 * ```ts
 * toPascalCase('hello world') // 'HelloWorld'
 * toPascalCase('va va boom') // 'VaVaBoom'
 * ```
 */
export function toPascalCase(str: string): string {
  const parts = str?.split(/[.\-\s_]/).map((x) => x.toLowerCase()) ?? [];
  if (parts.length === 0) return '';
  return parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');
}

/**
 * Formats the given string in title case fashion
 *
 * @example
 *
 * ```ts
 * toTitleCase('hello world') // 'Hello World'
 * toTitleCase('va_va_boom') // 'Va Va Boom'
 * toTitleCase('react-hooks') // 'React Hooks'
 * toTitleCase('queryItems') // 'Query Items'
 * ```
 */
export function toTitleCase(str: string | null | undefined): string {
  if (!str) return '';
  return str
    .split(/(?=[A-Z])|[.\-\s_]/)
    .map((s) => s.trim())
    .filter((s) => !!s)
    .map((s) => capitalize(s.toLowerCase()))
    .join(' ');
}

/**
 * Generates a random number between min and max
 *
 * @example
 *
 * ```ts
 * generateRandomNumber(1, 10)
 * ```
 */
export function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
