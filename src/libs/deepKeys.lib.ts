import isObject from 'lodash/isObject';

function deepKeys(
  obj: Record<string, unknown>,
  stack: Array<string | null>,
  parent: string | null,
  intermediate: boolean
) {
  Object.keys(obj).forEach((el) => {
    // Escape . in the element name
    const escaped = el.replace(/\./g, '\\.');
    // If it's a nested object
    if (isObject(obj[el]) && !Array.isArray(obj[el])) {
      // Concatenate the new parent if exist
      const p = parent ? `${parent}.${escaped}` : parent;
      // Push intermediate parent key if flag is true
      if (intermediate) stack.push(parent ? p : escaped);
      deepKeys(obj[el] as Record<string, unknown>, stack, p || escaped, intermediate);
    } else {
      // Create and save the key
      const key = parent ? `${parent}.${escaped}` : escaped;
      stack.push(key);
    }
  });
  return stack;
}

/**
 * Get an object, and return an array composed of it's properties names(nested too).
 * With intermediate equals to true, we include also the intermediate parent keys into the result
 *
 * @example
 * deepKeys({ a:1, b: { c:2, d: { e: 3 } } }) ==> ["a", "b.c", "b.d.e"]
 * @example
 * deepKeys({ b: { c:2, d: { e: 3 } } }, true) ==> ["b", "b.c", "b.d", "b.d.e"]
 * @example
 * deepKeys({ 'a.': { b: 1 }) ==> ["a\..b"]
 */
export default function deepKeysLib(obj: Record<string, unknown>, intermediate: boolean) {
  return deepKeys(obj, [], null, intermediate);
}
