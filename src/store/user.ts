/* eslint-disable @typescript-eslint/typedef */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { coin: number | null, processing: number[] } = {
    coin: null,
    processing: [],
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCoin: (state, action: PayloadAction<number>) => {
            state.coin = action.payload;
        },
        reduceCoin: (state) => {
            state.coin! -= 1;
        },
        addProcess: (state, action: PayloadAction<number>) => {
            state.processing = [ ...state.processing, action.payload ];
        },
        removeProcess: (state, action: PayloadAction<number>) => {
            state.processing = state.processing.filter((id) => id !== action.payload);
        },
    },
});

export const { setCoin, reduceCoin, addProcess, removeProcess } = userSlice.actions;
export default userSlice.reducer;
