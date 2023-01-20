export default `
import React from 'react';
import styles from './TemplateName.module.css';

export type TemplateNameProps {
  value: any;
}

function TemplateName({ value }: TemplateNameProps) {
  return (
    <div className={styles.TemplateName} data-testid="TemplateName">
      TemplateName Component
    </div>
  );
};

export default TemplateName;
`;
