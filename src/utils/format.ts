export const formatTokenAmount = (
  amountStr: string,
  maxDecimals: number = 4,
): string => {
  if (!amountStr) return '0';
  // Normalize input
  const [intPart, fracPart = ''] = amountStr.toString().split('.');
  if (maxDecimals <= 0) return intPart;
  const trimmed = fracPart.slice(0, maxDecimals).replace(/0+$/g, '');
  return trimmed ? `${intPart}.${trimmed}` : intPart;
};
