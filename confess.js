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
      if (messageInput.value === "") {
        alert("Enter something in the textfield");
        return;
      }
      
      // Clear the textarea
      messageInput.value = "";
  
      // 2. Increment the counter
      // First, we get the current counter value as a number (parseInt).
      
      let currentCount = parseInt(counterSpan.textContent) ;
  
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
  });
  