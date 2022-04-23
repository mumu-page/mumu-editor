import { createSlice } from '@reduxjs/toolkit'
import reducers from './reducers'
import { initialEditState } from './state'

export const editSlice = createSlice({
  name: 'edit',
  initialState: initialEditState,
  reducers: reducers
})

// export const incrementAsync = (amount: any) => (dispatch: (arg0: { payload: any; type: string }) => void) => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount))
//   }, 1000)
// }

export const selectCount = (state: { counter: { value: any } }) => state.counter.value

export const { returnConfig, setIsSave, addComponent, setDragStart, changeProps } = editSlice.actions

export default editSlice.reducer
