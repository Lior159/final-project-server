const admin = require("firebase-admin");
const serviceAccount = require(`./${process.env.FIREBASE_JSON_FILE_NAME}`);

let fcmToken;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL,
});

const sendActionToDevice = async (action) => {
  const message = {
    data: {
      action,
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

const fetchCoordinatesFromDatabase = async () => {
  const databaseRef = admin.database().ref(`locations/coordinates`);
  try {
    const snapshot = await databaseRef.once("value");
    coordinates = snapshot.val();
    console.log("Coordinates:", coordinates);
    return coordinates;
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};

module.exports = {
  sendActionToDevice,
  fetchTokenFromDatabase,
  fetchCoordinatesFromDatabase,
};
