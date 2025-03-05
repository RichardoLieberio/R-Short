import { Dispatch, SetStateAction } from 'react';

export type useVideoActionsReturn = {
    status: string;
    setStatus: Dispatch<SetStateAction<string>>;
    regenerateVideo: () => Promise<void>;
    downloadVideo: () => Promise<void>;
    removeVideo: () => Promise<void>;
};
