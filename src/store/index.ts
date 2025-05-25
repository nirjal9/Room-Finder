import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import favouriteReducer from './slices/favouriteSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        favourites: favouriteReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;