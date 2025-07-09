const cache = new Map<string, any>(
    JSON.parse(localStorage.getItem("yotify-cache") || "[]")
  );
  
  export const setCache = (key: string, value: any) => {
    cache.set(key, value);
    localStorage.setItem("yotify-cache", JSON.stringify(Array.from(cache.entries())));
  };
  
  export const getCache = (key: string) => cache.get(key);
  export const hasCache = (key: string) => cache.has(key);
  export const clearCache = () => {
    cache.clear();
    localStorage.removeItem("yotify-cache");
  };
  
  export default cache;  