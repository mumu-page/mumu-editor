import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import userReducer, { userSlice } from './user/index';
import editReducer, { editSlice } from './edit/index';
import { EditState } from './edit/state';
import { UserState } from './user/state';
import { useSelector, useStore } from 'react-redux';

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

export const useDiapatch = () => {
  const { dispatch } = useStore<RootStore>()
  return dispatch
}

export const useRootState = () => {
  const { getState } = useStore<RootStore>()
  return getState()
}

export const useEditState = () => {
  return useSelector((store: RootStore) => store.edit)
}

export const useUserState = () => {
  return useSelector((store: RootStore) => store.user)
}

export const actions = {
  ...editSlice.actions,
  ...userSlice.actions
}