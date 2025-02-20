import { protos } from '@google-cloud/text-to-speech';

export type FirebaseConfigurationType = {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
};

export type GeminiConfigurationType = {
    temperature: number;
    topP: number;
    topK: number;
    maxOutputTokens: number;
    responseMimeType: string;
};

export type ContentType = {
    imagePrompt: string;
    contentText: string;
};

export type AudioResponseType = [
    protos.google.cloud.texttospeech.v1.ISynthesizeSpeechResponse,
    protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest | undefined,
    object | undefined
];

export type ImageInputConfigurationType = {
    width: number;
    height: number;
    prompt: string;
    negative_prompt: string;
    scheduler: string;
    num_outputs: number;
    guidance_scale: number;
    num_inference_steps: number
};
