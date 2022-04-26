import { configureStore } from '@reduxjs/toolkit';
import userReducer, { decrement, increment, incrementByAmount } from './user/index';
import editReducer, { addComponent, changeProps, returnConfig, setDragStart, setIsSave } from './edit/index';
import { EditState } from './edit/state';
import { UserState } from './user/state';
import { useStore } from 'react-redux';

export interface RootStore {
  user: UserState,
  edit: EditState
}

export const store = configureStore({
  reducer: {
    user: userReducer,
    edit: editReducer
  },
});

export const useStoreMM = () => {
  const { getState, dispatch } = useStore<RootStore>()
  const store = getState()
  return { store, dispatch }
}

export const useEditState = () => {
  const { getState } = useStore<RootStore>()
  const store = getState()
  return store.edit
}

export const useUserState = () => {
  const { getState } = useStore<RootStore>()
  const store = getState()
  return store.user
}

export const actions = {
  returnConfig, setIsSave, addComponent, setDragStart, changeProps,
  increment, decrement, incrementByAmount
}