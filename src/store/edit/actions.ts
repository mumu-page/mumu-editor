import {createActionCreators, ImmerReducer} from "immer-reducer";

import {Selectors, EditState, TodoItem} from "./state";

/**
 * Actions that actually modify the todo content
 */
export class TodoReducer extends ImmerReducer<EditState> {
    selectors = new Selectors(this.draftState);

    addTodo(payload: {id: string}) {
        this.draftState.todos[payload.id] = {
            // Generating id like this is a side effect and should not be made
            // in side a reducer. Better place for it would be in a thunk for
            // example.
            saveState: "dirty",
            id: payload.id,
            text: "",
            completed: false,
        };
    }

    completeTodo(payload: {id: string}) {
        const todo = this.selectors.getTodo(payload.id);

        if (todo.saveState === "saving") {
            return;
        }

        todo.saveState = "dirty";
        todo.completed = true;
    }

    revertTodo(payload: {id: string}) {
        const todo = this.selectors.getTodo(payload.id);

        if (todo.saveState === "saving") {
            return;
        }

        todo.saveState = "dirty";
        todo.completed = false;
    }

    setTodoText(payload: {id: string; text: string}) {
        const todo = this.selectors.getTodo(payload.id);

        if (todo.saveState === "saving") {
            return;
        }

        todo.saveState = "dirty";
        todo.text = payload.text;
    }
}

/**
 * Actions for todo lifecycle management
 */
export class TodoLifecycleReducer extends ImmerReducer<EditState> {
    selectors = new Selectors(this.draftState);

    setSaving(payload: {id: string}) {
        const todo = this.selectors.getTodo(payload.id);
        todo.saveState = "saving";
    }

    setSaved(payload: {id: string}) {
        const todo = this.selectors.getTodo(payload.id);
        todo.saveState = "saved";
    }
}

export const TodoActions = createActionCreators(TodoReducer);
export const TodoLifecycleActions = createActionCreators(TodoLifecycleReducer);
