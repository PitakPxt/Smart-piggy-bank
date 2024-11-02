import { useEffect, useState } from "react";
import { useUserAuth } from "../context/AuthContext";

function YourComponent() {
  const [savingData, setSavingData] = useState(null);
  const { getData } = useUserAuth();
  const userId = "00002";

  useEffect(() => {
    const unsubscribe = getData(`saving/${userId}`, (data) => {
      setSavingData(data);
      console.log("ข้อมูลการออม:", data);
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
