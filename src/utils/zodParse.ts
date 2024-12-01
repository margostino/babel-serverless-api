import { z, ZodType } from 'zod'

export const zodParse = <Schema extends ZodType<any>>(
schema: Schema,
input: unknown
): z.infer<Schema> => {
try {
    return schema.parse(input)
  } catch (err: unknown) {
    throw Error('Error parsing zod schema')
  }
}
