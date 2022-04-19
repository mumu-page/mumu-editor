import { createReducerFunction } from "immer-reducer";
import { TodoReducer } from "./actions";
import { initialUserState } from "./state";

const userReducer = createReducerFunction(TodoReducer, initialUserState)

export {
    userReducer
}