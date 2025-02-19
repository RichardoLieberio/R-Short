import { z } from 'zod';

export default z.object({
    storyboard: z.string()
        .min(20, { message: 'Storyboard must be at least 20 characters.' })
        .max(255, { message: 'Storyboard cannot exceed 255 characters.' }),
    style: z.string()
        .min(3, { message: 'Style must be at least 3 characters long.' })
        .max(30, { message: 'Style cannot exceed 30 characters.' }),
});
