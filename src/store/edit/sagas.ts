import { isActionFrom } from "immer-reducer";
import { Action } from "redux";
import { all, debounce, put, takeLatest } from "redux-saga/effects";
import { TodoActions, TodoLifecycleActions, TodoReducer } from "./actions";

function* monitorTodo(action: ReturnType<typeof TodoActions.addTodo>) {
    const id = action.payload.id;

    yield saveTodo(id);
}

function* saveTodo(id: string) {
    yield put(TodoLifecycleActions.setSaving({ id }));
    yield put(TodoLifecycleActions.setSaved({ id }));
}

export function* editSaga() {
    yield takeLatest(TodoActions.addTodo.type, monitorTodo);
}


