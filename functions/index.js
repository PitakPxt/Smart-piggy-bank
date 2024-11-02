const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.addUserToParty = functions.firestore
  .document("party/{partyId}")
  .onCreate(async (snap, context) => {
    const partyData = snap.data();
    const db = admin.firestore();

    // ดึงข้อมูล user จาก member array
    const memberPromises = partyData.member.map(async (memberId) => {
      const userDoc = await db.collection("users").doc(memberId).get();
      return userDoc.data();
    });

    const members = await Promise.all(memberPromises);

    // อัพเดทข้อมูลใน party document
    return snap.ref.update({
      memberDetails: members,
    });
  });
