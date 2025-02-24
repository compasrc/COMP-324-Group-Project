document.addEventListener("DOMContentLoaded", function () {
    // Code inside here will only run after the entire HTML document (DOM) is loaded
    // ensuring that we can safely access elements by ID or class.
  
    const messageInput = document.getElementById("messageInput");
    // 'messageInput' references the <textarea> element where the user types their message.
  
    const burnButton = document.querySelector(".send-btn");
    // 'burnButton' references the "Burn" button (the first element with class "send-btn").
  
    const counterSpan = document.getElementById("counter");
    // 'counterSpan' references the <span> element inside <div id="confessionCounter">
    // where the counter number is displayed.

    //audio files for website
    const burnSound = new Audio("fire.mp3");
    const whisper = new Audio("whisper.mp3");
    whisper.volume = .3;
    burnSound.volume = .5;
  
    //init for bool to check if user typing and dec. for timer var
    let istyping = false;
    let timer;

  
    function burnMessage() {
      // This function is called whenever the user clicks the "Burn" button.
      //   Checking if the textbox is not empty.
      if (messageInput.value === "") {
        alert("Enter something in the textfield");
        return;
      }

      //pause + reset whisper sound
      whisper.pause();
      whisper.currentTime = 0;
      
      burnSound.play();
      
      // Clear the textarea
      setTimeout(function() {
        messageInput.value = "";
      }, 800);
      
  
      // 2. Increment the counter
      // First, we get the current counter value as a number (parseInt).
      
      let currentCount = parseInt(counterSpan.textContent);
  
      // Then, we set the text content to be the old count plus 1.
      counterSpan.textContent = currentCount + 1;
    }
  
    // Attach an event listener to the "Burn" button.
    // Whenever the button is clicked, call 'burnMessage'.
    burnButton.addEventListener("click", burnMessage);

    // Enter key functionality
    messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter"){
        e.preventDefault();
        burnMessage();
      }
    });
    
    //listener for user typing (keydown event)
    messageInput.addEventListener("keydown", function () {
      if (!istyping) {
        istyping = true;
        whisper.currentTime = 0;
        whisper.play();
      }

      //reset stop timer and times out if no typing 
      clearTimeout(timer);
      timer = setTimeout(stopWhisper, 500);
    });
    
    //restarts whisper if 'ended' event takes place
    whisper.addEventListener("ended", function() {
      if (istyping) {
        whisper.currentTime = 0;
        whisper.play();
      }
    });

    //function to stop whisper if user is not typing
    function stopWhisper() {
      istyping = false;
      whisper.pause();
      whisper.currentTime = 0;
      istyping = false;
  }
  
  });
  