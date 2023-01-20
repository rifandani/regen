export default `
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import templateName from './templateName.hook';

describe('templateName hook', () => {
  it('should be defined', () => {
    expect(templateName).toBeDefined();
  });
});
`;
