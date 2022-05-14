import {configureStore, createListenerMiddleware} from '@reduxjs/toolkit';
import userReducer, {userSlice} from './user/index';
import editReducer, {editSlice} from './edit/index';
import {EditState} from './edit/state';
import {UserState} from './user/state';
import {useStore} from 'react-redux';
import {postMsgToChild} from "@/utils/utils";
import {SET_IFRAME_COMPONENTS} from "@/constants";

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
  const {getState, dispatch} = useStore<RootStore>()
  const store = getState()
  return {store, dispatch}
}

export const useEditState = () => {
  const {getState} = useStore<RootStore>()
  const store = getState()
  return store.edit
}

export const useUserState = () => {
  const {getState} = useStore<RootStore>()
  const store = getState()
  return store.user
}

export const actions = {
  ...editSlice.actions,
  ...userSlice.actions
}