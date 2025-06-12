let lastEmotion = '';
let emotionStartTime = null;
let stableEmotion = '';
const STABLE_DURATION = 7000;

async function fetchEmotion() {
  try {
    const response = await fetch('/current_emotion');
    const data = await response.json();
    const detectedEmotion = data.emotion;

    document.getElementById("debug-emotion").textContent = "Current: " + detectedEmotion;

    if (detectedEmotion !== lastEmotion) {
      lastEmotion = detectedEmotion;
      emotionStartTime = new Date().getTime();
    } else {
      const now = new Date().getTime();
      if (now - emotionStartTime >= STABLE_DURATION && detectedEmotion !== stableEmotion) {
        stableEmotion = detectedEmotion;
        updateSuggestions(stableEmotion);
        console.log("Stable emotion:", stableEmotion);
      }
    }
  } catch (error) {
    console.error('Error fetching emotion:', error);
  }
}

function updateSuggestions(emotion) {
  const suggestionContainer = document.querySelector('.suggestions');
  const emotionText = document.querySelector('.emotion-text');
  emotionText.textContent = emotion;

  let suggestions = '';
  switch (emotion) {
    case 'happy':
      suggestions = `<ul>
        <li><a href="https://www.youtube.com/watch?v=G_zgUXH7mMg" target="_blank">Phir Se Ud Chala</a></li>
       
        <li><a href="https://www.youtube.com/watch?v=hrM-B8twb54" target="_blank">Udaan</a></li>
        <li><a href="https://www.youtube.com/watch?v=0JwHSCv0UhA" target="_blank">Aal Izz Well</a></li>
      </ul>`;
      break;
    case 'sad':
      suggestions = `<ul>
        <li><a href="https://www.youtube.com/watch?v=284Ov7ysmfA" target="_blank">Channa Mereya</a></li>
        <li><a href="https://www.youtube.com/watch?v=0FJkEetdI5I" target="_blank">Phir Le Aya Dil</a></li>
        <li><a href="https://www.youtube.com/watch?v=UM_JdwZqd60" target="_blank">Tum Hi Ho</a></li>
        <li><a href="https://www.youtube.com/watch?v=dZfF3EuW0zY" target="_blank">Bhula Dena</a></li>
      </ul>`;
      break;
    case 'angry':
      suggestions = `<ul>
        <li><a href="https://www.youtube.com/watch?v=bQz5yWfubSU" target="_blank">Mukkala Muqabala</a></li>
        <li><a href="https://www.youtube.com/watch?v=eq2gY3k_aqE" target="_blank">Malhari</a></li>
        <li><a href="https://www.youtube.com/watch?v=0AIXzF8RB4I" target="_blank">Jee Karda</a></li>
        <li><a href="https://www.youtube.com/watch?v=s9ApV2gU2Jw" target="_blank">Sadda Haq</a></li>
      </ul>`;
      break;
    case 'neutral':
      suggestions = `<ul>
       <li><a href="https://www.youtube.com/watch?v=xC8gkTBRwGY" target="_blank">Ilahi</a></li>
        <li><a href="https://www.youtube.com/watch?v=K0K46C82v9o" target="_blank">Tera Yaar Hoon Main</a></li>
        <li><a href="https://www.youtube.com/watch?v=pJ3HqfU3YcQ" target="_blank">Zinda</a></li>
        <li><a href="https://www.youtube.com/watch?v=Nswh9jF8n7E" target="_blank">Sapna Jahan</a></li>
      </ul>`;
      break;
    default:
      suggestions = '<p>No suggestions available for this emotion.</p>';
  }

  suggestionContainer.innerHTML = `<h2>Detected Emotion: <span class="emotion-text">${emotion}</span></h2>${suggestions}`;
}

setInterval(fetchEmotion, 1000);
