import { createContext, useContext, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { doc, setDoc } from "firebase/firestore";
import { db, realtimeDb } from "../lib/firebase";

const SavingContext = createContext();

export function SavingProvider({ children }) {
  useEffect(() => {
    // อ้างอิงไปที่ collection saving ใน Realtime Database
    const savingRef = ref(realtimeDb, "saving");

    // ติดตามการเปลี่ยนแปลงข้อมูลใน Realtime Database
    const unsubscribe = onValue(savingRef, async (snapshot) => {
      if (!snapshot.exists()) return;

      const savingData = snapshot.val();

      // วนลูปอัพเดทแต่ละ document ใน Firestore
      for (const [docId, data] of Object.entries(savingData)) {
        try {
          const docRef = doc(db, "saving", docId);
          await setDoc(docRef, {
            coin1: data.coin1 || 0,
            coin2: data.coin2 || 0,
            coin5: data.coin5 || 0,
            coin10: data.coin10 || 0,
            total:
              (data.coin1 || 0) +
              (data.coin2 || 0) * 2 +
              (data.coin5 || 0) * 5 +
              (data.coin10 || 0) * 10,
            updatedAt: new Date().toISOString(),
            // status: data.status || false,
          });
        } catch (error) {
          console.error(`Error updating document ${docId}:`, error);
        }
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  return <SavingContext.Provider value={{}}>{children}</SavingContext.Provider>;
}

export function useSaving() {
  return useContext(SavingContext);
}
