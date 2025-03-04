import { z } from 'zod';

export default z.object({
    style: z.string()
        .min(3, { message: 'Style must be at least 3 characters long.' })
        .max(30, { message: 'Style cannot exceed 30 characters.' }),
    duration: z.enum([ '15', '30', '60' ]),
    storyboard: z.string()
        .min(20, { message: 'Storyboard must be at least 20 characters.' }),
});
