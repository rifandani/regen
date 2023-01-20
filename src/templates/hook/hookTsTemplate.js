export default `
import React, { useRef } from 'react';

export type TemplateNameProps = {
  value: any;
};

/**
 * A Hook that returns the latest value, effectively avoiding the closure problem.
 *
 * @param {TemplateNameProps} value
 */
function templateName({ value }: TemplateNameProps) {
  const ref = useRef(value);
  ref.current = value;

  return ref;
};

export default templateName;
`;
