export {};

declare global {
    interface Window {
        snap?: {
            pay: (token: string) => void;
        };
    }
}
