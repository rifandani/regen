export default `import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TemplateNameStoreInitialState = {
  isOpen: boolean;
}

export const templateNameInitialState: TemplateNameStoreInitialState = {
  isOpen: false,
};

const templateNameSlice = createSlice({
  name: 'templateName',
  initialState: templateNameInitialState,
  reducers: {
    updateOpen: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isOpen: action.payload
    }),
    toggle: (state) => ({
      ...state,
      isOpen: !state.isOpen
    }),
    reset: () => templateNameInitialState,
  },
});

export const templateNameAction = templateNameSlice.actions;
export const templateNameReducer = templateNameSlice.reducer;
`;
