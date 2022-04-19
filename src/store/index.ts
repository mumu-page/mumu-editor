import {
    applyMiddleware,
    compose,
    legacy_createStore as createStore,
    combineReducers
} from "redux";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import { editReducer, editSaga } from "./edit";
import { EditState, initialEditState } from "./edit/state";
import { userReducer } from "./user";
import { useStore as useStoreRD } from 'react-redux'
import { initialUserState, UserState } from "./user/state";

export interface GlobalState {
    [key: string]: any;
    edit: EditState
    user: UserState
}

export const initialGlobalState: GlobalState = {
    edit: initialEditState,
    user: initialUserState
};

function* rootSaga() {
    yield all([editSaga()])
}

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: Function;
    }
}

const composeEnhancers =
    typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        })
        : compose;

function createRootStore() {
    const reducer = combineReducers({
        edit: editReducer,
        user: userReducer,
    });
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(
        reducer,
        composeEnhancers(applyMiddleware(sagaMiddleware)),
    );
    sagaMiddleware.run(rootSaga);
    return store;
}

export const store = createRootStore();


export const useStore = () => {
    const { getState } = useStoreRD<GlobalState>()
    const store = getState()
    return store
}