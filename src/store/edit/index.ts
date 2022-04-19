import { createReducerFunction } from "immer-reducer";
import { TodoReducer } from "./actions";
import { initialEditState } from "./state";
import { editSaga } from "./sagas";

const editReducer = createReducerFunction(TodoReducer, initialEditState)

export {
    editReducer,
    editSaga
}