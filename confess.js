document.addEventListener("DOMContentLoaded", function () {
  // Code inside here will only run after the entire HTML document (DOM) is loaded
  // ensuring that we can safely access elements by ID or class.

  const messageInput = document.getElementById("messageInput");
  const burnButton = document.querySelector(".send-btn");
  const micButton = document.getElementById("mic-btn");
  const counterSpan = document.getElementById("counter");

  // Audio files for website
  const burnSound = new Audio("fire.mp3");
  const whisper = new Audio("whisper.mp3");
  whisper.volume = 0.3;
  burnSound.volume = 0.5;

  let istyping = false;
  let timer;

  function burnMessage() {
    if (messageInput.value === "") {
      alert("Enter something in the textfield");
      return;
    }

    // Pause + reset whisper sound
    whisper.pause();
    whisper.currentTime = 0;

    // Promise for burn sound and glow effect
    burnSound.play().then(() => {
      setTimeout(() => {
        glowEffect();

        setTimeout(() => {
          messageInput.value = "";
        }, 800);

        let currentCount = parseInt(counterSpan.textContent);
        counterSpan.textContent = currentCount + 1;
      });
    }).catch((error) => {
      console.error("Error playing sound:", error);
    });
  }

  const screenGlow = document.querySelector(".screen-glow");

  const glowEffect = () => {
    screenGlow.classList.add("active");
    setTimeout(() => {
      screenGlow.classList.remove("active");
    }, 600);
  };

  // Event listeners
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

micButton.addEventListener("click", () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech recognition not supported in this browser.");
    return;
  }

  if (!recognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = true; // Keeps listening until YOU stop it

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
      if (isListening) recognition.start(); // 🔁 Auto-restart if it randomly ends
    };
  }

   // Set language before starting mic
   const selectedLang = languageSelect.value;
   recognition.lang = selectedLang;

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
