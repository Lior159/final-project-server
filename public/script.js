const startButton = document.querySelector(".start");
const stopButton = document.querySelector(".stop");
const pingButton = document.querySelector(".alert");
const statusLabel = document.createElement("div");

statusLabel.style.marginTop = "20px";
statusLabel.style.fontSize = "18px";
statusLabel.style.fontWeight = "bold";
statusLabel.style.color = "#333";

document.querySelector(".container").appendChild(statusLabel);

function sendCommand(action) {
  fetch("/action", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action }),
  })
    .then((response) => response.json())
    .then((data) => {
      statusLabel.textContent = `Status: ${data.status}`;
      statusLabel.style.color = data.success ? "green" : "red";
      return data;
    })
    .catch((error) => {
      statusLabel.textContent = "Status: Error sending command";
      statusLabel.style.color = "red";
    });
}

const startRecording = () => {
  sendCommand("START_RECORDING").then((res) => {
    startButton.style.display = "none";
    stopButton.style.display = "inline";
  });
};
const stopRecording = () => {
  sendCommand("STOP_RECORDING").then((res) => {
    startButton.style.display = "inline";
    stopButton.style.display = "none";
  });
};
const sendAlert = () => {
  sendCommand("START_ALERT");
};

const storeLocation = () => {};
const fetchLocation = () => {};

startButton.addEventListener("click", () => startRecording());
stopButton.addEventListener("click", () => stopRecording());
pingButton.addEventListener("click", () => sendAlert());
