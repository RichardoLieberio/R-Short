/* eslint-disable @typescript-eslint/typedef */

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import userReducer from '@store/user';

const store = configureStore({
    reducer: {
        user: userReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type useAppSelectorType = TypedUseSelectorHook<ReturnType<typeof store.getState>>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: useAppSelectorType = useSelector;
export default store;
