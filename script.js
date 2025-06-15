// Global Variables
let voices = [];
let currentUtterance = null;

// Theme Management
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem('theme', newTheme);
}

// Voice Management
function populateVoices() {
  voices = speechSynthesis.getVoices();
  const voiceSelect = document.getElementById("voiceSelect");
  voiceSelect.innerHTML = "";
  
  if (voices.length === 0) {
    const option = document.createElement("option");
    option.textContent = "No voices available";
    option.disabled = true;
    voiceSelect.appendChild(option);
    return;
  }

  // Add default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Default Voice";
  voiceSelect.appendChild(defaultOption);

  // Add available voices
  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });

  // Restore saved voice selection
  const savedVoice = localStorage.getItem('selectedVoice');
  if (savedVoice !== null) {
    voiceSelect.value = savedVoice;
  }
}

// Speech Synthesis Functions
function readText() {
  // Stop any current speech
  stopSpeech();

  const content = document.getElementById("content").innerText;
  currentUtterance = new SpeechSynthesisUtterance(content);
  
  const voiceSelect = document.getElementById("voiceSelect");
  if (voiceSelect.value && voices[voiceSelect.value]) {
    currentUtterance.voice = voices[voiceSelect.value];
  }
  
  // Set speech parameters
  currentUtterance.rate = 1;
  currentUtterance.pitch = 1;
  currentUtterance.volume = 1;

  // Event listeners for user feedback
  currentUtterance.onstart = function() {
    console.log('Speech started');
  };

  currentUtterance.onend = function() {
    console.log('Speech ended');
    currentUtterance = null;
  };

  currentUtterance.onerror = function(event) {
    console.error('Speech error:', event.error);
    currentUtterance = null;
  };

  // Save voice selection
  localStorage.setItem('selectedVoice', voiceSelect.value);

  speechSynthesis.speak(currentUtterance);
}

function stopSpeech() {
  speechSynthesis.cancel();
  currentUtterance = null;
}

// Keyboard Shortcuts
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', function(event) {
    // Space bar to play/stop (when not focused on a form element)
    if (event.code === 'Space' && !['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(event.target.tagName)) {
      event.preventDefault();
      if (speechSynthesis.speaking) {
        stopSpeech();
      } else {
        readText();
      }
    }
    
    // 'T' key for theme toggle
    if (event.key === 't' || event.key === 'T') {
      if (!['INPUT', 'TEXTAREA'].includes(event.target.tagName)) {
        toggleTheme();
      }
    }
  });
}

// Event Listeners
function setupEventListeners() {
  // Voice selection changes
  document.getElementById("voiceSelect").addEventListener('change', function() {
    localStorage.setItem('selectedVoice', this.value);
  });

  // Clean up speech synthesis on page unload
  window.addEventListener('beforeunload', function() {
    stopSpeech();
  });
}

// Initialize Application
function initializeApp() {
  // Initialize theme
  initializeTheme();
  
  // Setup voices
  populateVoices();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
  }
  
  // Setup keyboard shortcuts
  setupKeyboardShortcuts();
  
  // Setup event listeners
  setupEventListeners();
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);


// let mediaRecorder;
// let audioChunks = [];

// function downloadSpeech() {
//   stopSpeech(); // Stop current playback if any

//   const content = document.getElementById("content").innerText;
//   const utterance = new SpeechSynthesisUtterance(content);

//   const synth = window.speechSynthesis;
//   const audioContext = new AudioContext();
//   const destination = audioContext.createMediaStreamDestination();
//   const mediaStream = destination.stream;

//   const source = audioContext.createMediaStreamSource(destination.stream);
//   mediaRecorder = new MediaRecorder(mediaStream);
//   audioChunks = [];

//   mediaRecorder.ondataavailable = e => {
//     if (e.data.size > 0) {
//       audioChunks.push(e.data);
//     }
//   };

//   mediaRecorder.onstop = () => {
//     const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
//     const url = URL.createObjectURL(audioBlob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'speech.webm'; // or change to .wav
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   const synthUtterance = new SpeechSynthesisUtterance(content);
//   const selectedVoice = document.getElementById("voiceSelect").value;
//   if (selectedVoice && voices[selectedVoice]) {
//     synthUtterance.voice = voices[selectedVoice];
//   }

//   synthUtterance.onstart = () => {
//     const sourceNode = audioContext.createMediaStreamSource(destination.stream);
//     sourceNode.connect(audioContext.destination); // Optional: route audio to speakers
//     mediaRecorder.start();
//   };

//   synthUtterance.onend = () => {
//     mediaRecorder.stop();
//   };

//   // Patch speech to play via AudioContext (this is a workaround, not precise)
//   const utteranceSource = audioContext.createOscillator(); // Dummy to start context
//   utteranceSource.connect(destination);
//   utteranceSource.start();
//   utteranceSource.stop(audioContext.currentTime + 0.1);

//   synth.speak(synthUtterance);
// }


// function downloadSpeech() {
//   const content = document.getElementById("content").innerText;
//   const utterance = new SpeechSynthesisUtterance(content);
//   const selectedVoiceIndex = document.getElementById("voiceSelect").value;

//   if (selectedVoiceIndex && voices[selectedVoiceIndex]) {
//     utterance.voice = voices[selectedVoiceIndex];
//   }

//   const audioContext = new AudioContext();
//   const destination = audioContext.createMediaStreamDestination();
//   const synth = window.speechSynthesis;

//   const mediaRecorder = new MediaRecorder(destination.stream);
//   const audioChunks = [];

//   mediaRecorder.ondataavailable = e => {
//     if (e.data.size > 0) {
//       audioChunks.push(e.data);
//     }
//   };

//   mediaRecorder.onstop = () => {
//     const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
//     const audioUrl = URL.createObjectURL(audioBlob);
//     const downloadLink = document.createElement("a");
//     downloadLink.href = audioUrl;
//     downloadLink.download = "ai_hustle_speech.webm";
//     document.body.appendChild(downloadLink);
//     downloadLink.click();
//     document.body.removeChild(downloadLink);
//     URL.revokeObjectURL(audioUrl);
//   };

//   utterance.onstart = () => {
//     const sourceNode = audioContext.createMediaStreamSource(destination.stream);
//     sourceNode.connect(audioContext.destination); // Play sound while recording
//     mediaRecorder.start();
//   };

//   utterance.onend = () => {
//     mediaRecorder.stop();
//   };

//   // Force audio context to start
//   const dummySource = audioContext.createOscillator();
//   dummySource.connect(destination);
//   dummySource.start();
//   dummySource.stop(audioContext.currentTime + 0.1);

//   synth.speak(utterance);
// }


// function downloadSpeech() {
//   const text = document.getElementById("content").innerText.trim();

//   if (text.length === 0) {
//     alert("No text to read.");
//     return;
//   }

//   const maxLength = 200; // Max allowed by Google Translate TTS
//   const encodedText = encodeURIComponent(text.slice(0, maxLength));
//   const ttsURL = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodedText}&tl=en`;

//   // Create audio element to play
//   const audio = new Audio(ttsURL);
//   audio.play();

//   // Trigger download
//   const a = document.createElement("a");
//   a.href = ttsURL;
//   a.download = "speech.mp3";
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
// }

function downloadAsMP3() {
  const downloadBtn = document.getElementById("downloadBtn");
  const API_KEY = "AIzaSyD-S1MaySuZ5kPc9TwE4ChoJpTit-Vkxdg"; // Replace with your real API key
  const text = document.getElementById("content").innerText.trim();

  if (text.length === 0) {
    alert("No text to convert.");
    return;
  }

  // Show loader state
  downloadBtn.disabled = true;
  const originalText = downloadBtn.innerHTML;
  downloadBtn.innerHTML = "⏳ Generating...";

  const requestData = {
    input: { text },
    voice: {
      languageCode: "en-US",
      name: "en-US-Wavenet-D",
      ssmlGender: "MALE"
    },
    audioConfig: {
      audioEncoding: "MP3"
    }
  };

  fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestData)
  })
    .then(res => res.json())
    .then(data => {
      if (!data.audioContent) {
        alert("Failed to generate audio. Please check your API key or quota.");
        return;
      }

      // Convert base64 to MP3 Blob
      const byteCharacters = atob(data.audioContent);
      const byteArrays = [];
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));
      }
      const audioBlob = new Blob([new Uint8Array(byteArrays)], { type: "audio/mp3" });

      // Trigger file download
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ai_hustle_reader.mp3";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    })
    .catch(err => {
      console.error("Download failed:", err);
      alert("Error generating audio. Please check the console for details.");
    })
    .finally(() => {
      // Restore button
      downloadBtn.disabled = false;
      downloadBtn.innerHTML = originalText;
    });
}
