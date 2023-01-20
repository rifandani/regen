export default `
import React from 'react';
import useTemplateNameViewModel from './TemplateName.viewModel';

describe('TemplateName view model', () => {
  it('should be defined', () => {
    expect(useTemplateNameViewModel).toBeDefined();
  });
});
`;
