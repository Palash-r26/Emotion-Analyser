let detectedEmotions = [];
let stableEmotion = null;
let timer = null;

function captureEmotion(emotion) {
  detectedEmotions.push(emotion);

  if (!timer) {
    timer = setTimeout(() => {
      stableEmotion = getDominantEmotion(detectedEmotions);
      sendEmotion(stableEmotion);
    }, 7000);
  }
}

function getDominantEmotion(emotions) {
  const counts = {};
  emotions.forEach(emotion => {
    counts[emotion] = (counts[emotion] || 0) + 1;
  });

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function sendEmotion(emotion) {
  fetch('/emotion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emotion: emotion })
  })
  .then(res => res.json())
  .then(data => {
    window.location.href = '/result?emotion=' + encodeURIComponent(emotion);
  });
}
