const flattenObject = (obj: Record<string, any>, prefix = ''): Record<string, any> => {
  return Object.keys(obj).reduce((acc, k) => {
    const newPrefix = prefix ? `${prefix}${k.charAt(0).toUpperCase()}${k.slice(1)}` : k;
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], newPrefix));
    } else {
      acc[newPrefix] = obj[k];
    }
    return acc;
  }, {} as Record<string, any>);
};

export default flattenObject;