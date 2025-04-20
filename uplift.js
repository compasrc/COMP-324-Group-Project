// ==============================
// API Configuration
// ==============================

const API_CONFIG = {
  url: "https://api.allorigins.win/raw?url=https://zenquotes.io/api/random",
  options: {
    cache: "no-store",
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

// ==============================
// DOM Elements
// ==============================

const DOM = {
  quoteText: document.getElementById("quote-text"),
  fetchButton: document.getElementById("fetch-quote"),
  navToggle: document.getElementById("nav-toggle"),
  navClose: document.getElementById("nav-close"),
  navMenu: document.getElementById("nav-menu")
};

// ==============================
// Fetch Quote from API or Local Fallback
// ==============================

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
    console.error("API failed. Attempting to load from local JSON...", error);
    return await loadLocalQuote();
  }
}

async function loadLocalQuote() {
  try {
    const response = await fetch('quotes.json');
    const data = await response.json();

    if (!Array.isArray(data.quotes) || data.quotes.length === 0) {
      throw new Error("Local fallback quotes are invalid or empty.");
    }

    const random = data.quotes[Math.floor(Math.random() * data.quotes.length)];
    return random;
  } catch (error) {
    console.error("Local quote fetch also failed:", error);
    return { q: "No quote available at the moment.", a: "— System" };
  }
}

// ==============================
// Update UI with Quote
// ==============================

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
  void DOM.quoteText.offsetWidth;
  DOM.quoteText.classList.add('animate-update');
}

// ==============================
// Handle New Quote Button Click
// ==============================

async function handleNewQuoteClick() {
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
    if (DOM.fetchButton) {
      DOM.fetchButton.disabled = false;
      DOM.fetchButton.classList.remove('loading');
    }
  }
}

// ==============================
// Setup Navigation
// ==============================

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

  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      DOM.navMenu.classList.remove('show-menu');
    });
  });
}

// ==============================
// App Initialization
// ==============================

function initApp() {
  if (DOM.fetchButton) {
    DOM.fetchButton.addEventListener("click", handleNewQuoteClick);
  }

  setupNavigation();
  handleNewQuoteClick();

  window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY >= 50) {
      header.classList.add('scroll-header');
    } else {
      header.classList.remove('scroll-header');
    }
  });
}

document.addEventListener('DOMContentLoaded', initApp);

// Optional Module Export
export { initApp, fetchQuote, handleNewQuoteClick };
