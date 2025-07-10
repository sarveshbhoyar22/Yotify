// const cache = new Map<string, any>(
//     JSON.parse(localStorage.getItem("yotify-cache") || "[]")
//   );
  
//   export const setCache = (key: string, value: any) => {
//     cache.set(key, value);
//     localStorage.setItem("yotify-cache", JSON.stringify(Array.from(cache.entries())));
//   };
  
//   export const getCache = (key: string) => cache.get(key);
//   export const hasCache = (key: string) => cache.has(key);
//   export const clearCache = () => {
//     cache.clear();
//     localStorage.removeItem("yotify-cache");
//   };
  
//   export default cache;  


import { doc, getDoc, setDoc, Firestore, serverTimestamp } from "firebase/firestore";

let firestoreDb: Firestore | null = null;

export const initCache = (dbInstance: Firestore) => {
  firestoreDb = dbInstance;
};

// --- Local cache setup ---
const cache = new Map<string, any>(
  JSON.parse(localStorage.getItem("yotify-cache") || "[]")
);

export const setCache = (key: string, value: any) => {
  cache.set(key, value);
  localStorage.setItem(
    "yotify-cache",
    JSON.stringify(Array.from(cache.entries()))
  );

  if (firestoreDb) {
    const ref = doc(firestoreDb, "yotifyCache", key);
    setDoc(ref, { ...value, createdAt: serverTimestamp() }, { merge: true });
  }
};

export const getCache = (key: string) => cache.get(key);
export const hasCache = (key: string) => cache.has(key);

// Try Firebase cache if not found locally
export const fetchFromCache = async (key: string): Promise<any | null> => {
  if (hasCache(key)) return getCache(key);

  if (firestoreDb) {
    try {
      const docRef = doc(firestoreDb, "yotifyCache", key);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setCache(key, data); // Also update local cache
        return data;
      }
    } catch (e) {
      console.warn("Failed to fetch from Firestore cache:", e);
    }
  }

  return null;
};

export const clearCache = () => {
  cache.clear();
  localStorage.removeItem("yotify-cache");
};

export default cache;
