document.addEventListener("DOMContentLoaded", function () {
  // Code inside here will only run after the entire HTML document (DOM) is loaded
  // ensuring that we can safely access elements by ID or class.

  const messageInput = document.getElementById("messageInput");
  const burnButton = document.querySelector(".send-btn");
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
});
