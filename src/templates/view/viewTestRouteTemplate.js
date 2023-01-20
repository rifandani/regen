export default `
import React from 'react';
import TemplateNameRoute from './TemplateName.route';
import TemplateNameView from './TemplateName.view';

describe('TemplateName route', () => {
  it('should have correct path route', () => {
    expect(TemplateNameRoute.path).toEqual('/TemplateName');
  });

  it('should have correct element', () => {
    expect(TemplateNameRoute.element).toEqual(<TemplateNameView />);
  });
});
`;
