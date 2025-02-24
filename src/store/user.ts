/* eslint-disable @typescript-eslint/typedef */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { coin: number | null } = {
    coin: null,
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
    },
});

export const { setCoin, reduceCoin } = userSlice.actions;
export default userSlice.reducer;
