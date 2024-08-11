const admin = require("firebase-admin");
const serviceAccount = require("./final-project-23698-firebase-adminsdk-tppr0-1f7763d0c5.json");

let fcmToken;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://final-project-23698-default-rtdb.europe-west1.firebasedatabase.app",
});

const sendActionToDevice = async (action) => {
  const message = {
    data: {
      action, // "start" or "stop"
    },
    token: fcmToken,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
    return "Successfully sent message";
  } catch (error) {
    throw new Error("Error sending message:", error);
  }
};

const fetchTokenFromDatabase = async () => {
  const databaseRef = admin.database().ref(`tokens/token`);
  try {
    const snapshot = await databaseRef.once("value");
    fcmToken = snapshot.val();
    console.log("FCM Token:", fcmToken);
    return fcmToken;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
};

module.exports = {
  sendActionToDevice,
  fetchTokenFromDatabase,
};
