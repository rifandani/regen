export default `import { storeTest } from '../../utils/test/test.util'; // NOTE: edit this path to match your mock store
import { templateNameAction, templateNameAdapter } from './templateName.store';

describe('TemplateName initial state', () => {
  it('has correct initial values', () => {
    expect(storeTest.store.getState().templateNameAction).toEqual(templateNameAdapter.getInitialState());
  });
});

describe('TemplateName reducer', () => {
  it('\`templateNameActionAdded\` action should work correctly', () => {
    const payload = { bookId: '1', title: 'book1' };

    const action = storeTest.store.dispatch(templateNameAction.templateNameAdded(payload));

    expect(action).toEqual({
      payload,
      type: 'templateNameAction/templateNameAdded',
    });
  });
});
`;
