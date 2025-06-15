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