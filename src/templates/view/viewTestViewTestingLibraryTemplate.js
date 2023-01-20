export default `
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TemplateNameView from './TemplateName.view';

describe('<TemplateNameView />', () => {
  it('should mount', () => {
    render(<TemplateNameView />);

    const templateNameView = screen.getByTestId('TemplateNameView');

    expect(templateNameView).toBeInTheDocument();
  });
});
`;
