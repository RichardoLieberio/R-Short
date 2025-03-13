import { z } from 'zod';

export default z.object({
    coin: z.number().min(0, { message: 'Coin value cannot be negative' }),
});
