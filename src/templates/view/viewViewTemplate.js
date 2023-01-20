export default `
import React from 'react';
import useTemplateNameViewModel from './TemplateName.viewModel';

function TemplateNameView() {
  const templateNameVM = useTemplateNameViewModel();

  return (
    <main data-testid="TemplateNameView">
      <h1>TemplateName view</h1>
    </main>
  );
}

export default TemplateNameView;
`;
