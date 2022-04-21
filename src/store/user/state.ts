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