import { z } from 'zod';

export const appointeeSchema = z.object({
  id: z.string(),
  name: z.string(),
  jobTitle: z.string(),
});
export type Appointee = z.infer<typeof appointeeSchema>;

export interface AppointeeSearchRequestBody {
  searchTerm: string;
}
export const appointeeSearchResponseSchema = z.array(appointeeSchema);
export type AppointeeSearchResponse = z.infer<typeof appointeeSearchResponseSchema>;
