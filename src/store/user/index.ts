import { createSlice } from '@reduxjs/toolkit'
import { initialUserState } from './state'

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    increment: (state) => {
      // state.id += 1
    },
    decrement: (state) => {
      // state.id -= 1
    },
    incrementByAmount: (state, action) => {
      // state.id += action.payload
    },
  },

})

export const { increment, decrement, incrementByAmount } = userSlice.actions

export const incrementAsync = (amount: any) => (dispatch: (arg0: { payload: any; type: string }) => void) => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount))
  }, 1000)
}

export const selectCount = (state: { counter: { value: any } }) => state.counter.value

export default userSlice.reducer
