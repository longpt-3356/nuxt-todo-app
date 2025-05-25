export const getErrorMessage = (err: unknown): string => {
  return (err as any)?.errors?.[0]?.message || 
         (err as Error)?.message || 
         '何かエラーが発生しました。もう一度お試しください。';
}