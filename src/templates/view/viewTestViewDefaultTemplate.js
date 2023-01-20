export default `
import React from 'react';
import ReactDOM from 'react-dom';
import TemplateNameView from './TemplateName.view';

describe('<TemplateNameView />', () => {
  it('should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TemplateNameView />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
`;
