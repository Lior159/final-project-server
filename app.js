const express = require("express");
const bodyParser = require("body-parser");
const {
  fetchTokenFromDatabase,
  sendActionToDevice,
} = require("./firebase_util");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post("/action", (req, res) => {
  const action = req.body.action;
  sendActionToDevice(action)
    .then((result) => {
      let status;
      switch (action) {
        case "START_RECORDING":
          res.json({ action, status: "Recording Started", success: true });
          break;
        case "STOP_RECORDING":
          res.json({ action, status: "Recording Stopped", success: true });
          break;
        case "START_ALERT":
          res.json({ action, status: "Alert sent", success: true });
          break;
        default:
          res.json({ action, status: "Other action", success: true });
          break;
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ action, status: "Failed", success: false });
    });
});

fetchTokenFromDatabase()
  .then((res) => {
    app.listen(3000);
    console.log("server is running port 3000");
  })
  .catch((err) => {
    console.log(err);
  });
