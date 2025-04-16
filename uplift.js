const api_url = "https://api.allorigins.win/raw?url=https://zenquotes.io/api/random";

// Function to fetch and show a new quote
async function fetchNewQuote() {
  try {
    const response = await fetch(api_url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Unexpected API response format");
    }

    const quote = `"${data[0].q}" — ${data[0].a}`;
    const quoteTextEl = document.getElementById("quote-text");

    if (quoteTextEl) {
      quoteTextEl.innerText = quote;
    }
    console.log("API call success ");

  } catch (error) {
    console.error("Error fetching quote:", error);
    const quoteTextEl = document.getElementById("quote-text");
    if (quoteTextEl) {
      quoteTextEl.innerText = "Oops! Couldn't fetch a quote. Please try again.";
    }
  }
}

// When page loads, set up the button click
window.onload = function () {
  const quoteBtn = document.getElementById("fetch-quote");
  if (quoteBtn) {
    quoteBtn.addEventListener("click", fetchNewQuote);
  }

  // Load a quote on page load
  fetchNewQuote();
};
