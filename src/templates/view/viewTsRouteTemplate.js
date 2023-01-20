export default `
import React from 'react';
import { RouteObject } from 'react-router-dom';
import TemplateNameView from './TemplateName.view';

export type TemplateNameRouteParams = {
  state: any;
};

const TemplateNameRoute: RouteObject = {
  index: false,
  path: '/TemplateName',
  element: <TemplateNameView />,
};

export default TemplateNameRoute;
`;
