const unflattenObject = (data: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  for (const i in data) {
    const keys = i.match(/[A-Z][a-z]+|[a-z]+/g) || [];
    keys.reduce((acc, key, idx) => {
      const formattedKey = idx === 0 ? key.toLowerCase() : key.charAt(0).toLowerCase() + key.slice(1);
      return acc[formattedKey] || (acc[formattedKey] = isNaN(Number(keys[idx + 1])) ? (keys.length - 1 === idx ? data[i] : {}) : []);
    }, result);
  }
  return result;
};

export default unflattenObject;