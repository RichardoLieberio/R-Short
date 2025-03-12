export type useCoinCardReturn = {
    handlingPurchase: boolean;
    handlePurchase: (packageId: number) => Promise<void>;
};
