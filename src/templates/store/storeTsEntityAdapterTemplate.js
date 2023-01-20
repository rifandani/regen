export default `import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

export type TemplateNameEntity = { templateNameId: string; title: string }

export const templateNameAdapter = createEntityAdapter<TemplateNameEntity>({
  // Assume entity IDs are stored in a key other than \`templateName.id\`
  selectId: (templateName) => templateName.templateNameId,
  // Keep the "all IDs" array sorted based on templateName title
  sortComparer: (a, b) => a.title.localeCompare(b.title),
})

const templateNameSlice = createSlice({
  name: 'templateName',
  initialState: templateNameAdapter.getInitialState(),
  reducers: {
    // Can pass adapter functions directly as case reducers.
    // Because we're passing this as a value, \`createSlice\` will auto-generate the \`templateNameAdded\` action type / creator
    templateNameAdded: templateNameAdapter.addOne,
    templateNameReceived(state, action) {
      // Or, call them as "mutating" helpers in a case reducer
      templateNameAdapter.setAll(state, action.payload.templateName)
    },
  },
});

export const templateNameAction = templateNameSlice.actions;
export const templateNameReducer = templateNameSlice.reducer;
`;
