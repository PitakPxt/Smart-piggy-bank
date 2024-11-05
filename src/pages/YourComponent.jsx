import { useEffect, useState } from "react";
import { useUserAuth } from "../context/AuthContext";

function YourComponent() {
  const [savingData, setSavingData] = useState(null);
  const { getRealtimeDb } = useUserAuth();
  const userId = "00001";

  useEffect(() => {
    const unsubscribe = getRealtimeDb(`saving/${userId}`, async (data) => {
      setSavingData(data);
      console.log("ข้อมูลการออม:", data);

      try {
        const { setDoc, doc } = await import("firebase/firestore");
        const { db } = await import("../lib/firebase");

        await setDoc(doc(db, "saving", userId), {
          coin1: data.coin1 || 0,
          coin2: data.coin2 || 0,
          coin5: data.coin5 || 0,
          coin10: data.coin10 || 0,
          total: calculateTotal(data),
          updatedAt: new Date().toISOString(),
        });

        console.log("บันทึกข้อมูลลง Firestore สำเร็จ");
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการบันทึกลง Firestore:", error);
      }
    });
    return () => unsubscribe();
  }, []);

  const calculateTotal = (data) => {
    if (!data) return 0;
    return (
      (data.coin1 || 0) * 1 +
      (data.coin2 || 0) * 2 +
      (data.coin5 || 0) * 5 +
      (data.coin10 || 0) * 10
    );
  };

  return (
    <div>
      {savingData ? (
        <div className="border p-4 rounded">
          <h3>ผู้ใช้: 00001</h3>
          <div className="grid grid-cols-2 gap-4">
            <p>เหรียญ 1 บาท: {savingData.coin1}</p>
            <p>เหรียญ 2 บาท: {savingData.coin2}</p>
            <p>เหรียญ 5 บาท: {savingData.coin5}</p>
            <p>เหรียญ 10 บาท: {savingData.coin10}</p>
            <p>ยอดรวม: {calculateTotal(savingData)} บาท</p>
          </div>
        </div>
      ) : (
        <p>กำลังโหลดข้อมูล...</p>
      )}
    </div>
  );
}

export default YourComponent;
