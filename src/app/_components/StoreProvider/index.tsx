'use client';

import { ReactNode, JSX } from 'react';
import { Provider } from 'react-redux';
import store from '@store';

export default function StoreProvider({ children }: { children: ReactNode }): JSX.Element {
    return (
        <Provider store={store}>
            { children }
        </Provider>
    );
}
