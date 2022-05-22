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
  setDragStart,
  changeProps,
  reset,
  onLoad,
  onRemoteComponentLoad,
  onEvent,
  setConfig,
} = editSlice.actions

export default editSlice.reducer