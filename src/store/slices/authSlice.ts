import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface User {
    id: number;
    name: string;
    email: string;
    roles: {
        id: number;
        name: string;
    }[];
}

interface AuthState {
    user: User | null;
    token: string | null;
}

// Load initial state from localStorage
const loadState = (): AuthState => {
    try {
        const serializedState = localStorage.getItem('auth');
        if (serializedState === null) {
            return {
                user: null,
                token: null,
            };
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return {
            user: null,
            token: null,
        };
    }
};

const initialState: AuthState = loadState();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<{user: User; token: string}>) {
            state.user = action.payload.user;
            state.token = action.payload.token;
            // Save to localStorage
            localStorage.setItem('auth', JSON.stringify({
                user: action.payload.user,
                token: action.payload.token
            }));
        },
        logout(state) {
            state.user = null;
            state.token = null;
            // Clear localStorage
            localStorage.removeItem('auth');
        },
    },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;