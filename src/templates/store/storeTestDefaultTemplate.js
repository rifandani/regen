export default `import { storeTest } from '../../utils/test/test.util'; // NOTE: edit this path to match your mock store
import { templateNameInitialState, templateNameAction, templateNameReducer } from './templateName.store';

describe('TemplateName initial state', () => {
  it('has correct initial state', () => {
    expect(storeTest.store.getState().templateName).toEqual(templateNameInitialState);
  });
});

describe('TemplateName reducer actions', () => {
  it('should be able to "updateOpen" correctly', () => {
    const action = storeTest.store.dispatch(templateNameAction.updateOpen(true));

    expect(action.type).toEqual('templateName/updateOpen');
    expect(action.payload).toEqual(true);
    expect(storeTest.store.getState().templateName).toEqual({
      isOpen: true,
    });
  });

  it('should be able to "toggle" correctly', () => {
    const initialState = storeTest.store.getState().templateName;
    const action = storeTest.store.dispatch(templateNameAction.toggle());

    expect(action.type).toEqual('templateName/toggle');
    expect(action.payload).toEqual(undefined);
    expect(storeTest.store.getState().templateName).toEqual({
      isOpen: !initialState.isOpen,
    });
  });

  it('should be able to "reset" correctly', () => {
    storeTest.store.dispatch(templateNameAction.toggle());

    const action = storeTest.store.dispatch(templateNameAction.reset());

    expect(action.type).toEqual('templateName/reset');
    expect(action.payload).toEqual(undefined);
    expect(storeTest.store.getState().templateName).toEqual({
      isOpen: false
    });
  });
});
`;
