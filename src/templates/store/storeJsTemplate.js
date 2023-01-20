export default `import { createSlice } from '@reduxjs/toolkit';

export const templateNameInitialState = {
  isOpen: false;
};

const templateNameSlice = createSlice({
  name: 'templateName',
  initialState: templateNameInitialState,
  reducers: {
    toggle: (state) => ({
      ...state,
      isOpen: !state.isOpen
    }),
    updateOpen: (state, action) => ({
      ...state,
      isOpen: action.payload
    }),
    reset: () => templateNameInitialState,
  },
});

export const templateNameAction = templateNameSlice.actions;
export const templateNameReducer = templateNameSlice.reducer;
`;
