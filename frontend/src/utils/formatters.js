// Indian Rupee (INR) currency formatting utility
export const formatINR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  const numeric = Math.round(Number(amount));
  return `₹${numeric.toLocaleString('en-IN')}`;
};

export const formatINRWithDecimals = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0.00';
  }
  return `₹${Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
