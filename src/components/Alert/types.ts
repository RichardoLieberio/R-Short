import { Dispatch, SetStateAction, ReactNode } from 'react';

export type AlertProps = {
    status: string,
    setStatus: Dispatch<SetStateAction<string>>,
    navigate: boolean;
};

export type AlertDialogContentProps = {
    title: ReactNode;
    description: ReactNode;
    footer?: ReactNode;
};
