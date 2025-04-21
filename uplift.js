import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDOJcoGtUImT_jCQvyw6RvqJl9-Woqu5dQ",
  authDomain: "moodquotes-9e657.firebaseapp.com",
  projectId: "moodquotes-9e657",
  storageBucket: "moodquotes-9e657.firebasestorage.app",
  messagingSenderId: "123007476409",
  appId: "1:123007476409:web:3fe6b8b33dc7470354b168"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const quoteText = document.getElementById("quote-text");

const API_CONFIG = {
  url: `https://api.allorigins.win/raw?url=https://zenquotes.io/api/random&timestamp=${Date.now()}`,
  options: {
    cache: "no-store",
    headers: { 'Content-Type': 'application/json' }
  }
};

// Mobile navigation menu toggle functionality
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

// Show menu
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.add('show-menu');
  });
}

// Hide menu
if (navClose) {
  navClose.addEventListener('click', () => {
    navMenu.classList.remove('show-menu');
  });
}

// Close menu when clicking on a nav link
const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('show-menu');
  });
});

// Guide popup
document.getElementById("open-guide").addEventListener("click", e => {
  e.preventDefault();
  document.getElementById("guide-popup").style.display = "flex";
});
document.getElementById("close-guide").addEventListener("click", () => {
  document.getElementById("guide-popup").style.display = "none";
});

window.fetchQuoteByMood = async function (mood) {
  quoteText.innerText = "Fetching magic...";

  if (mood === "random") {
    try {
      const response = await fetch("https://zenquotes.io/api/random");
      if (!response.ok) throw new Error(`Network issue: ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data) || !data[0]) throw new Error("Invalid quote format");
      quoteText.innerText = `${data[0].q} — ${data[0].a}`;
    } catch (error) {
      console.warn("API failed. Trying quotes.json instead...");

      try {
        const localResponse = await fetch("quotes.json");
        if (!localResponse.ok) throw new Error("quotes.json not found");
        const localData = await localResponse.json();

        const quotesArray = localData.quotes || [];
        if (!Array.isArray(quotesArray) || quotesArray.length === 0) {
          throw new Error("Invalid quotes.json format");
        }

        const fallback = quotesArray[Math.floor(Math.random() * quotesArray.length)];
        quoteText.innerText = `"${fallback.q}" — ${fallback.a || "Anonymous"}`;
      } catch (jsonErr) {
        console.error("Both API and local fetch failed:", jsonErr);
        quoteText.innerText = "Couldn't fetch any quotes. Please try again later.";
      }
    }
  } else {
    try {
      const q = query(collection(db, "quotes"), where("mood", "==", mood));
      const snapshot = await getDocs(q);
      const quotes = [];
      snapshot.forEach(doc => quotes.push(doc.data()));
      if (quotes.length > 0) {
        const selected = quotes[Math.floor(Math.random() * quotes.length)];
        quoteText.innerText = `${selected.text} — ${selected.author || "Anonymous"}`;
      } else {
        quoteText.innerText = "No quotes found for this mood.";
      }
    } catch (err) {
      console.error("Error fetching from Firebase:", err);
      quoteText.innerText = "Error loading mood-based quote.";
    }
  }
};


window.addEventListener("DOMContentLoaded", async () => {
  await window.fetchQuoteByMood("random");
});

const calmVideos = [
  { title: "Deep Sleep Rainstorm", id: "yIQd2Ya0Ziw" },
  { title: "Calming Green Noise", id: "xfBgJEVxQz8" },
  { title: "Ambient Library Rainstorm", id: "CHFif_y2TyM" },
  { title: "Cozy Cabin Thunderstorm", id: "L2D8e0FYc-E" }
];

document.addEventListener("DOMContentLoaded", () => {
  const selector = document.getElementById("videoSelector");
  const player = document.getElementById("calmingVideo");

  if (selector && player) {
    calmVideos.forEach(video => {
      const option = document.createElement("option");
      option.value = video.id;
      option.textContent = video.title;
      selector.appendChild(option);
    });

    selector.addEventListener("change", () => {
      const videoId = selector.value;
      player.src = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`;
    });
  }
});