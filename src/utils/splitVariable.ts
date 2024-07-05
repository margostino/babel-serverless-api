export const splitVariable = (variable: string | undefined) => {
  return variable?.split(',').map((h) => h.trim()) || []
}
