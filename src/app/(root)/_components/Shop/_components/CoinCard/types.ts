export type useCoinCardReturn = {
    handlingPurchase: boolean;
    rupiahFormat: (price: number) => string;
    handlePurchase: (packageId: number) => Promise<void>;
};
