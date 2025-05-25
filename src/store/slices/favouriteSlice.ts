import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface FavouriteState {
    favourites: number[]; // Array of room IDs
}

// Load initial state from localStorage
const loadState = (): FavouriteState => {
    try {
        const serializedState = localStorage.getItem('favourites');
        if (serializedState === null) {
            return {
                favourites: [],
            };
        }
        const parsedState = JSON.parse(serializedState);
        return {
            favourites: Array.isArray(parsedState) ? parsedState : [],
        };
    } catch (err) {
        return {
            favourites: [],
        };
    }
};

const initialState: FavouriteState = loadState();

const favouriteSlice = createSlice({
    name: 'favourites',
    initialState,
    reducers: {
        toggleFavourite(state, action: PayloadAction<number>) {
            const roomId = action.payload;
            const index = state.favourites.indexOf(roomId);
            
            if (index === -1) {
                // Add to favourites
                state.favourites.push(roomId);
            } else {
                // Remove from favourites
                state.favourites.splice(index, 1);
            }
            
            // Save to localStorage
            localStorage.setItem('favourites', JSON.stringify(state.favourites));
        },
        setFavourites(state, action: PayloadAction<number[]>) {
            // Ensure we have a valid array of numbers
            const newFavourites = Array.isArray(action.payload) ? action.payload : [];
            // Replace the entire array
            state.favourites = newFavourites;
            // Save to localStorage
            localStorage.setItem('favourites', JSON.stringify(state.favourites));
        },
        clearFavourites(state) {
            state.favourites = [];
            // Clear localStorage
            localStorage.removeItem('favourites');
        }
    },
});

export const { toggleFavourite, setFavourites, clearFavourites } = favouriteSlice.actions;
export default favouriteSlice.reducer; 