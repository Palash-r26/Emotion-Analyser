const songs = {
  happy: [
    { title: "Phir Se Ud Chala - Rockstar", url: "https://youtu.be/2mWaqsC3U7k" },
    { title: "Gallan Goodiyan - Dil Dhadakne Do", url: "https://youtu.be/FLz2eQtI_1w" },
    { title: "London Thumakda - Queen", url: "https://youtu.be/udra3Mfw2oo" },
    { title: "Aaj Ki Party - Bajrangi Bhaijaan", url: "https://youtu.be/x4UjdNUjwoQ" }
  ],
  sad: [
    { title: "Channa Mereya - Ae Dil Hai Mushkil", url: "https://www.youtube.com/watch?v=284Ov7ysmfA" },
    { title: "Tujhe Kitna Chahne Lage - Kabir Singh", url: "https://www.youtube.com/watch?v=Bi2vFf0oDF0" },
    { title: "Agar Tum Saath Ho - Tamasha", url: "https://www.youtube.com/watch?v=sK7riqg2mr4" },
    { title: "Bhula Dena - Aashiqui 2", url: "https://www.youtube.com/watch?v=nU1VfYYKMDk" }
  ],
  angry: [
    { title: "Zinda - Bhaag Milkha Bhaag", url: "https://www.youtube.com/watch?v=1PYaK8KUB1w" },
    { title: "Khoon Chala - Rang De Basanti", url: "https://www.youtube.com/watch?v=HnZvq9PZBq8" },
    { title: "Malang - Title Track", url: "https://www.youtube.com/watch?v=FkKjZz2vpy4" },
    { title: "Bhaag D.K. Bose - Delhi Belly", url: "https://www.youtube.com/watch?v=Yj4n-n6drZQ" }
  ],
  neutral: [
    { title: "Ilahi - Yeh Jawaani Hai Deewani", url: "https://youtu.be/fdubeMFwuGs?si=8af8184pArN2_L4t" },
    { title: "Kun Faya Kun - Rockstar", url: "https://www.youtube.com/watch?v=T94PHkuydcw" },
    { title: "Raabta - Agent Vinod", url: "https://youtu.be/zlt38OOqwDc" },
    { title: "Dil Diyan Gallan - Tiger Zinda Hai", url: "https://www.youtube.com/watch?v=SAcpESN_Fk4" }
  ],
  surprise: [
    { title: "Jabra Fan - Fan", url: "https://www.youtube.com/watch?v=Z8pTqFjcJCs" },
    { title: "Nashe Si Chadh Gayi - Befikre", url: "https://www.youtube.com/watch?v=p7bfOZek9t4" },
    { title: "Kar Gayi Chull - Kapoor & Sons", url: "https://www.youtube.com/watch?v=gEFZ6Ind9qE" }
  ],
  fear: [
    { title: "Naina - Dangal", url: "https://www.youtube.com/watch?v=9_5bMdHuTuA" },
    { title: "Khamoshiyan - Khamoshiyan", url: "https://www.youtube.com/watch?v=slvMgWv7K4M" },
    { title: "Jiyein Kyun - Dum Maaro Dum", url: "https://www.youtube.com/watch?v=5wFiF2GYx4A" }
  ],
  disgust: [
    { title: "Swag Se Swagat - Tiger Zinda Hai", url: "https://www.youtube.com/watch?v=xkHdMxwwTTg" },
    { title: "Breakup Song - Ae Dil Hai Mushkil", url: "https://www.youtube.com/watch?v=O_Nq3T2pF0I" },
    { title: "Lets Nacho - Kapoor & Sons", url: "https://www.youtube.com/watch?v=K4xLi8IF1HE" }
  ]
};

let lastEmotion = "";
let stableEmotion = "";
let emotionStartTime = null;
const STABLE_DURATION = 7000;
let isProcessingFrame = false;

const videoEl = document.getElementById("webcam");
const canvasEl = document.getElementById("snapshot-canvas");
const canvasCtx = canvasEl.getContext("2d");
const debugEl = document.getElementById("debug-emotion");
const emotionEl = document.querySelector(".emotion-text");

// Apply camera flip (mirror effect) via CSS
if (videoEl) {
  videoEl.style.transform = "scaleX(-1)";
}

function getVideoId(url) {
  if (url.includes("watch?v=")) {
    return url.split("watch?v=")[1].split("&")[0];
  }
  if (url.includes("youtu.be/")) {
    return url.split("youtu.be/")[1].split("?")[0];
  }
  if (url.includes("embed/")) {
    return url.split("embed/")[1].split("?")[0];
  }
  return "";
}

function updateBackgroundColor(emotion) {
  const colors = {
    happy: "#fff9c4",
    sad: "#e1bee7",
    angry: "#ffcdd2",
    neutral: "#e0f7fa",
    surprise: "#ffe082",
    fear: "#cfd8dc",
    disgust: "#f8bbd0"
  };
  document.body.style.backgroundColor = colors[emotion] || "#e0f7fa";
}

function updateSongs(emotion) {
  const container = document.getElementById("song-cards");
  container.innerHTML = "";

  const recommended = songs[emotion] || songs.neutral;
  recommended.forEach((song) => {
    const videoId = getVideoId(song.url);
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    const card = document.createElement("div");
    card.innerHTML = `
      <a href="${song.url}" target="_blank" style="display:flex; align-items:center; text-decoration:none; color:inherit; gap:12px;">
        <img src="${thumbnailUrl}" width="180" style="border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.35)" />
        <span style="font-size:18px; color:#000;">${song.title}</span>
      </a>
    `;
    container.appendChild(card);
  });

  emotionEl.textContent = emotion;
  updateBackgroundColor(emotion);
}

function refreshPage() {
  const refreshBtn = document.querySelector(".refresh-button");
  refreshBtn.style.transform = "translateX(-50%) scale(0.95)";
  setTimeout(() => window.location.reload(), 150);
}

async function processCurrentFrame() {
  if (!videoEl || videoEl.readyState < 2 || isProcessingFrame) {
    return;
  }

  isProcessingFrame = true;

  // Flip the canvas horizontally to send un-flipped frame to server for correct emotion detection
  canvasCtx.save();
  canvasCtx.scale(-1, 1);
  canvasCtx.drawImage(videoEl, -canvasEl.width, 0, canvasEl.width, canvasEl.height);
  canvasCtx.restore();
  const imageData = canvasEl.toDataURL("image/jpeg", 0.8);

  try {
    const response = await fetch("/process_frame", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ image: imageData })
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "Failed to process frame.");
    }

    const detectedEmotion = payload.emotion || "Detecting...";
    debugEl.textContent = `Current: ${detectedEmotion}`;
    emotionEl.textContent = detectedEmotion;

    if (detectedEmotion !== lastEmotion) {
      lastEmotion = detectedEmotion;
      emotionStartTime = Date.now();
      updateBackgroundColor(detectedEmotion);
      return;
    }

    if (!emotionStartTime) {
      emotionStartTime = Date.now();
      return;
    }

    const elapsed = Date.now() - emotionStartTime;
    if (elapsed >= STABLE_DURATION && detectedEmotion !== stableEmotion) {
      stableEmotion = detectedEmotion;
      updateSongs(stableEmotion);
    }
  } catch (error) {
    console.error("Frame processing error:", error);
    debugEl.textContent = "Current: Camera/analysis error";
  } finally {
    isProcessingFrame = false;
  }
}

async function startWebcam() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    debugEl.textContent = "Current: Browser does not support webcam access";
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
      audio: false
    });
    videoEl.srcObject = stream;
    debugEl.textContent = "Current: Webcam started";
  } catch (error) {
    console.error("Webcam access error:", error);
    debugEl.textContent = "Current: Webcam access denied/unavailable";
  }
}

window.refreshPage = refreshPage;
startWebcam().then(() => {
  processCurrentFrame();
  setInterval(processCurrentFrame, 3000);
});
