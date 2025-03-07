export type useCoinCardReturn = {
    rupiahFormat: (price: number) => string;
    handlePurchase: (packageId: number) => Promise<void>;
};
