/* eslint-disable @typescript-eslint/typedef */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type initialStateType = {
    coin: number | null;
    processing: { [ id: number ]: string };
};

const initialState: initialStateType = {
    coin: null,
    processing: {},
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCoin: (state, action: PayloadAction<number>) => {
            state.coin = action.payload;
        },
        reduceCoin: (state) => {
            if (state.coin !== null) state.coin -= 1;
        },
        addProcess: (state, action: PayloadAction<{ id: number, type: string }>) => {
            state.processing[action.payload.id] = action.payload.type;
        },
        removeProcess: (state, action: PayloadAction<number>) => {
            delete state.processing[action.payload];
        },
    },
});

export const { setCoin, reduceCoin, addProcess, removeProcess } = userSlice.actions;
export default userSlice.reducer;
