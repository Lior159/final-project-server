const startButton = document.querySelector(".start");
const stopButton = document.querySelector(".stop");
const alertButton = document.querySelector(".alert");
const stopAlertButton = document.querySelector(".stop-alert");
const locationButton = document.querySelector(".location");
const statusLabel = document.createElement("div");

statusLabel.style.marginTop = "20px";
statusLabel.style.fontSize = "18px";
statusLabel.style.fontWeight = "bold";
statusLabel.style.color = "#333";

document.querySelector(".container").appendChild(statusLabel);

function sendCommand(action) {
  return fetch("/action", {
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

const stopAlert = () => {
  sendCommand("STOP_ALERT");
};

const getLocation = () => {
  sendCommand("GET_LOCATION").then((res) => {
    const { coodrinates } = res;
    updateMap(coodrinates.latitude, coodrinates.longitude);
  });
};

startButton.addEventListener("click", () => startRecording());
stopButton.addEventListener("click", () => stopRecording());
alertButton.addEventListener("click", () => sendAlert());
stopAlertButton.addEventListener("click", () => stopAlert());
locationButton.addEventListener("click", () => getLocation());

const map = L.map("map").setView([0, 0], 2); // Default view before location is retrieved

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

let marker;

// Function to update the map with the new location
function updateMap(latitude, longitude) {
  if (marker) {
    marker.setLatLng([latitude, longitude]);
  } else {
    marker = L.marker([latitude, longitude]).addTo(map);
  }
  map.setView([latitude, longitude], 13); // Zoom in to the location
}
