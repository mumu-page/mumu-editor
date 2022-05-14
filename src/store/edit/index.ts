import {createSlice} from '@reduxjs/toolkit'
import reducers from './reducers'
import {initialEditState} from './state'

export const editSlice = createSlice({
  name: 'edit',
  initialState: initialEditState,
  reducers: reducers
})

export const {
  returnConfig,
  addComponent,
  setDragStart,
  changeProps,
  reset,
  setCurrentComponent,
  deleteComponent,
  copyComponent,
  sortComponent,
  onLoad,
  onRemoteComponentLoad
} = editSlice.actions

export default editSlice.reducer