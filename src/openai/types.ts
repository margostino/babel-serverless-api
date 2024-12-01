import { z } from 'zod'

export const ClassificationResponseCompletionSchema = z.object({
  thinking_process: z.string(),
  keys: z.array(z.string()),
})

export type ClassificationResponseCompletion = z.infer<typeof ClassificationResponseCompletionSchema>