import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/index';
import editReducer from './edit/index';
import { EditState } from './edit/state';
import { UserState } from './user/state';

export interface RootStore {
  user: UserState,
  edit: EditState
}

export default configureStore({
  reducer: {
    user: userReducer,
    edit: editReducer
  },
});

// export const useStore = () => {
//   const { getState } = useStoreRD<GlobalState>()
//   const store = getState()
//   return store
// }