export interface UserState {
    id: string;
    text: string;
    completed: boolean;
    // saveState: "saved" | "dirty" | "saving";
}

export const initialUserState: UserState = {
    id: '32234234',
    text: '23232',
    completed: false
};

/**
 * Some state selection helpers. Using helper like makes it easier to refactor
 * the the state structure when required. This selector helper can be used in
 * both the render prop connect and the Immer Reducer.
 */
export class Selectors {
    state: UserState;

    constructor(state: UserState) {
        this.state = state;
    }

    // getTodoIDs() {
    //     return Object.values(this.state.user)
    //         .filter(user => !user.completed)
    //         .map(user => user.id);
    // }

    // getComletedIDs() {
    //     return Object.values(this.state.user)
    //         .filter(user => user.completed)
    //         .map(user => user.id);
    // }

    // getTodo(id: string) {
    //     const maybeTodo = this.state.user[id];
    //     if (!maybeTodo) {
    //         throw new Error("Cannot find todo with id: " + id);
    //     }
    //     return maybeTodo;
    // }
}
