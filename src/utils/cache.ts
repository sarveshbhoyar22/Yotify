import {
    doc,
    getDoc,
    setDoc,
    getDocs,
    collection,
    Firestore,
    serverTimestamp,
  } from "firebase/firestore";
  
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
    //   console.log("data set in firebase cache !!!!!");
    }
  };
  
  export const getCache = (key: string) => cache.get(key);
  export const hasCache = (key: string) => cache.has(key);
  
  // 🆕 Preload entire Firestore cache into localStorage
  export const preloadFirestoreCache = async () => {
    if (!firestoreDb) return;
  
    try {
      const snap = await getDocs(collection(firestoreDb, "yotifyCache"));
      snap.forEach((docSnap) => {
        const key = docSnap.id;
        const data = docSnap.data();
        cache.set(key, data);
      });
  
      localStorage.setItem(
        "yotify-cache",
        JSON.stringify(Array.from(cache.entries()))
      );
  
      console.log("✅ Preloaded entire Firestore cache to localStorage");
    } catch (err) {
    //   console.error("🔥 Failed to preload Firestore cache:", err);
    }
  };
  
  export const fetchFromCache = async (key: string): Promise<any | null> => {
    if (hasCache(key)) {
    //   console.log("📦 Fetching from local cache:", key);
      return getCache(key);
    }
  
    if (firestoreDb) {
    //   console.log("🌐 Fetching from Firestore cache:", key);
      try {
        const docRef = doc(firestoreDb, "yotifyCache", key);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          const value = Array.isArray(data) ? data : Object.values(data);
          setCache(key, value);
          return value;
        }
      } catch (e) {
        // console.warn("⚠️ Failed to fetch from Firestore:", e);
      }
    }
  
    return null;
  };
  
  export const clearCache = () => {
    cache.clear();
    localStorage.removeItem("yotify-cache");
  };
  
  export default cache;
  