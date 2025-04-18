
document.addEventListener("DOMContentLoaded", function () {
  // Access core elements
  const messageInput = document.getElementById("messageInput");
  const burnButton   = document.querySelector(".send-btn");
  const micButton    = document.getElementById("mic-btn");
  const counterSpan  = document.getElementById("counter");

  // Intro‑Popup Logic & Quick‑Intro Trigger
  const introPopup    = document.getElementById("introPopup");
  const introCloseBtn = document.getElementById("introCloseBtn");
  const introTrigger  = document.getElementById("introTrigger");

  introTrigger.addEventListener("click", function (e) {
    e.preventDefault();
    introPopup.classList.remove("hidden");
  });

  introCloseBtn.addEventListener("click", function () {
    introPopup.classList.add("hidden");
  });

  //  Fire animation elements
  const fireAnimation = document.querySelector('.fire-animation');
 

  // Audio files for website
  const burnSound = new Audio("fire.mp3");
  burnSound.volume = 0.5;

   // fire-only background animation
   const glowEffect = () => {
    fireAnimation.classList.add("active");
    setTimeout(() => {
      fireAnimation.classList.remove("active");
    }, 600);
  };
  
   // Core burn logic
  function burnMessage() {
    if (messageInput.value === "") {
      alert("Enter something in the textfield");
      return;
    }

    // Eclear the text immediately
  const userText = messageInput.value;      
  messageInput.value = "";                   

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const track = audioContext.createMediaElementSource(burnSound);
    track.connect(audioContext.destination);

    audioContext.resume().then(() => {
      burnSound.play();
      glowEffect();
    });

    setTimeout(() => {
      let currentCount = parseInt(counterSpan.textContent);
      counterSpan.textContent = currentCount + 1;
    }, 600);
  }

  // Event listeners for burn
  burnButton.addEventListener("click", burnMessage);
  messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      burnMessage();
    }
  });

  // 🎤 Speech-to-Text Functionality
  let recognition;
  let isListening = false;

  
  const languageSelect = document.getElementById("languageSelect");
 

  micButton.addEventListener("click", () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    if (!recognition) {
      recognition = new SpeechRecognition();
      recognition.lang = languageSelect.value;
      recognition.interimResults = false;
      recognition.continuous = true;

      recognition.onresult = function (event) {
        const transcript = event.results[event.results.length - 1][0].transcript;
        messageInput.value += (messageInput.value ? " " : "") + transcript;
      };

      recognition.onerror = function (event) {
        console.error("Speech recognition error:", event.error);
        isListening = false;
        micButton.textContent = "🎤";
      };

      recognition.onend = function () {
        if (isListening) recognition.start();
      };
    } else {
      recognition.lang = languageSelect.value;
    }

    if (!isListening) {
      recognition.start();
      isListening = true;
      micButton.textContent = "🔴 Stop";
    } else {
      recognition.stop();
      isListening = false;
      micButton.textContent = "🎤";
    }
  });
});
