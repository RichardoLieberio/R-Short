/* eslint-disable @typescript-eslint/typedef */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type initialStateType = {
    coin: number | null;
    processing: { [ id: number ]: string };
    openShop: boolean;
    handlingPurchase: boolean;
    processingUser: { [ clerkId: string ]: string };
    totalTransactions: number | null;
    totalUsers: number | null;
};

const initialState: initialStateType = {
    coin: null,
    processing: {},
    openShop: false,
    handlingPurchase: false,
    processingUser: {},
    totalTransactions: null,
    totalUsers: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCoin: (state, action: PayloadAction<number>) => {
            state.coin = action.payload;
        },
        incrementCoin: (state) => {
            state.coin! += 1;
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
        setOpenShop: (state, action: PayloadAction<boolean>) => {
            state.openShop = action.payload;
        },
        setHandlingPurchase: (state, action: PayloadAction<boolean>) => {
            state.handlingPurchase = action.payload;
        },
        addUserProcess: (state, action: PayloadAction<{ clerkId: string, type: string }>) => {
            state.processingUser[action.payload.clerkId] = action.payload.type;
        },
        removeUserProcess: (state, action: PayloadAction<string>) => {
            delete state.processingUser[action.payload];
        },
        setTotalTransactions: (state, action: PayloadAction<number | null>) => {
            state.totalTransactions = action.payload;
        },
        setTotalUsers: (state, action: PayloadAction<number | null>) => {
            state.totalUsers = action.payload;
        },
    },
});

export const { setCoin, incrementCoin, reduceCoin, addProcess, removeProcess, setOpenShop, setHandlingPurchase, addUserProcess, removeUserProcess, setTotalTransactions, setTotalUsers } = userSlice.actions;
export default userSlice.reducer;
