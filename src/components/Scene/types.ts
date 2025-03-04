import { Caption } from '../../app/(root)/video/types';

export type SceneProps = {
    scale: number;
    imageUri: string;
    audioUri: string;
    captions: Caption[],
};
