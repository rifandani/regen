export default `
import React, { useRef } from 'react';

/**
 * A Hook that returns the latest value, effectively avoiding the closure problem.
 *
 * @param {{ value: any; }} value
 */
function templateName({ value }) {
  const ref = useRef(value);
  ref.current = value;

  return ref;
};

export default templateName;
`;
