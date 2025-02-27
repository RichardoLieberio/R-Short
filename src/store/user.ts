/* eslint-disable @typescript-eslint/typedef */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { coin: number | null, deleting: number[] } = {
    coin: null,
    deleting: [],
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
        addDelete: (state, action: PayloadAction<number>) => {
            state.deleting = [ ...state.deleting, action.payload ];
        },
        removeDelete: (state, action: PayloadAction<number>) => {
            state.deleting = state.deleting.filter((id) => id !== action.payload);
        },
    },
});

export const { setCoin, reduceCoin, addDelete, removeDelete } = userSlice.actions;
export default userSlice.reducer;
