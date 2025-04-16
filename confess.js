document.addEventListener("DOMContentLoaded", function () {
  // Code inside here will only run after the entire HTML document (DOM) is loaded
  // ensuring that we can safely access elements by ID or class.

  const messageInput = document.getElementById("messageInput");
  const burnButton = document.querySelector(".send-btn");
  const counterSpan = document.getElementById("counter");

  // Audio files for website
  const burnSound = new Audio("fire.mp3");

  burnSound.volume = 0.5;

  let istyping = false;
  let timer;

  function burnMessage() {
    if (messageInput.value === "") {
        alert("Enter something in the textfield");
        return;
    }

    /*
     * Use AudioContext API for precise timing of burn effect and fire sound.
     * Some browsers use webkitAudioContext instead, so it is included as well.
     */
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioElement = burnSound;
    const track = audioContext.createMediaElementSource(audioElement);

    // Connect the audio track to the destination (speakers)
    track.connect(audioContext.destination);
    
    // Use promise to start the burn sound and glow effect at the same time
    audioContext.resume().then(() => {
      burnSound.play();
      glowEffect();
    });

    // Wait for the glow effect to complete
    setTimeout(() => {
        messageInput.value = "";

        let currentCount = parseInt(counterSpan.textContent);
        counterSpan.textContent = currentCount + 1;
    }, 600);
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
