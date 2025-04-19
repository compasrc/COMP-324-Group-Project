// API Configuration
const API_CONFIG = {
  url: "https://api.allorigins.win/raw?url=https://zenquotes.io/api/random",
  options: { 
    cache: "no-store",
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

// DOM Elements
const DOM = {
  quoteText: document.getElementById("quote-text"),
  fetchButton: document.getElementById("fetch-quote"),
  navToggle: document.getElementById("nav-toggle"),
  navClose: document.getElementById("nav-close"),
  navMenu: document.getElementById("nav-menu")
};

/**
 * Fetch a random quote from the API
 * @returns {Promise<Object>} The quote data
 */
async function fetchQuote() {
  try {
    const response = await fetch(API_CONFIG.url, API_CONFIG.options);
    
    if (!response.ok) {
      throw new Error(`Network error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid API response format");
    }
    
    return data[0];
  } catch (error) {
    console.error("Error fetching quote:", error);
    throw error;
  }
}

/**
 * Update the UI with a new quote or error message
 * @param {string} text - The text to display
 * @param {boolean} isError - Whether this is an error message
 */
function updateQuoteDisplay(text, isError = false) {
  if (!DOM.quoteText) return;
  
  DOM.quoteText.innerText = text;
  
  if (isError) {
    DOM.quoteText.classList.add('error');
  } else {
    DOM.quoteText.classList.remove('error');
  }
  
  // Add animation effect when quote changes
  DOM.quoteText.classList.remove('animate-update');
  void DOM.quoteText.offsetWidth; // Trigger reflow to restart animation
  DOM.quoteText.classList.add('animate-update');
}

/**
 * Handle the button click event to fetch and display a new quote
 */
async function handleNewQuoteClick() {
  // Disable button during fetch to prevent multiple requests
  if (DOM.fetchButton) {
    DOM.fetchButton.disabled = true;
    DOM.fetchButton.classList.add('loading');
  }
  
  try {
    updateQuoteDisplay("Loading new inspiration...");
    const quoteData = await fetchQuote();
    updateQuoteDisplay(`"${quoteData.q}" — ${quoteData.a}`);
  } catch (error) {
    updateQuoteDisplay("Couldn't fetch a quote. Please try again later.", true);
  } finally {
    // Re-enable button
    if (DOM.fetchButton) {
      DOM.fetchButton.disabled = false;
      DOM.fetchButton.classList.remove('loading');
    }
  }
}

/**
 * Set up mobile navigation functionality
 */
function setupNavigation() {
  if (DOM.navToggle) {
    DOM.navToggle.addEventListener('click', () => {
      DOM.navMenu.classList.add('show-menu');
    });
  }
  
  if (DOM.navClose) {
    DOM.navClose.addEventListener('click', () => {
      DOM.navMenu.classList.remove('show-menu');
    });
  }
  
  // Close menu when clicking on nav links
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      DOM.navMenu.classList.remove('show-menu');
    });
  });
}

/**
 * Initialize the application
 */
function initApp() {
  // Set up event listeners
  if (DOM.fetchButton) {
    DOM.fetchButton.addEventListener("click", handleNewQuoteClick);
  }
  
  // Set up mobile navigation
  setupNavigation();
  
  // Load a quote on page load
  handleNewQuoteClick();
  
  // Add scroll event listener for header style changes
  window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY >= 50) {
      header.classList.add('scroll-header');
    } else {
      header.classList.remove('scroll-header');
    }
  });
}

// Initialize the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);

// Add this to make it work as a module
export { initApp, fetchQuote, handleNewQuoteClick };