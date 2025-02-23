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

  function burnMessage() {
    // This function is called whenever the user clicks the "Burn" button.
    //   Checking if the textbox is not empty.
    if (messageInput.value.trim() === "") {
      alert("Enter something in the textfield");
      return;
    }

    // Store the message text and clear the input field
    let messageText = messageInput.value;
    messageInput.value = "";


    //New div  element to display the burning message
    let burnedMessage = document.createElement("div");

    // Class for styling
    burnedMessage.classList.add("burned-message");

    // Set the text content to the user's message
    burnedMessage.textContent = messageText;

    // Add the message to the document
    document.body.appendChild(burnedMessage);


    // Message stays visible for 1.5 seconds
    setTimeout(() => {
      burnedMessage.style.opacity = "0";
    }, 1500);

    // Fully disappears after 3 seconds and increment the counter
    setTimeout(() => {
      burnedMessage.remove();
      counterSpan.textContent = parseInt(counterSpan.textContent) + 1;
    }, 3000);
  }

  // Attach an event listener to the "Burn" button.
  // Whenever the button is clicked, call 'burnMessage'.
  burnButton.addEventListener("click", burnMessage);

  // Enter key functionality
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      burnMessage();
    }
  });
});
