document.addEventListener("DOMContentLoaded", function () {
  // Access core elements
  const messageInput = document.getElementById("messageInput");
  const burnButton = document.querySelector(".send-btn");
  const micButton = document.getElementById("mic-btn");
  const counterSpan = document.getElementById("counter");
  const confessionForm = document.getElementById("confessionForm");
  const errorMsg = document.getElementById("error-msg");
  const clearButton = document.getElementById("clearButton");
  const wordCountDisplay = document.getElementById("wordCount");
  
  // Form elements to reset
  const genderSelect = document.getElementById("genderSelect");
  const ageSelect = document.getElementById("ageSelect");
  const dateSelect = document.getElementById("dateSelect");

  // Navigation buttons
  const homeBtn = document.getElementById("homeBtn");
  if (homeBtn) {
    homeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "home.html";
    });
  }
  const lighthouseBtn = document.getElementById("lighthouseBtn");

  // Intro‑Popup Logic & Quick‑Intro Trigger
  const introPopup = document.getElementById("introPopup");
  const introCloseBtn = document.getElementById("introCloseBtn");
  const introTrigger = document.getElementById("introTrigger");

  // Check if this is the first visit and show intro popup
  if (!localStorage.getItem("visitedBefore")) {
    introPopup.classList.remove("hidden");
    localStorage.setItem("visitedBefore", "true");
  }

  introTrigger.addEventListener("click", function (e) {
    e.preventDefault();
    introPopup.classList.remove("hidden");
  });

  introCloseBtn.addEventListener("click", function () {
    introPopup.classList.add("hidden");
  });

  // Navigation button event listeners
  if (homeBtn) {
    homeBtn.addEventListener("click", function() {
      window.location.href = "home.html";
    });
  }

  if (lighthouseBtn) {
    lighthouseBtn.addEventListener("click", function() {
      window.location.href = "uplift.html";
    });
  }

  // Firebase counter initialization
  let confessionCount = 0;
  initializeCounter();

  // Fire animation elements
  const fireAnimation = document.querySelector('.fire-animation');
  const screenGlow = document.querySelector('.screen-glow');
  
  // Create fire animation overlay for the text input
  const textBoxFireOverlay = document.createElement("div");
  textBoxFireOverlay.className = "textbox-fire-overlay";
  textBoxFireOverlay.style.position = "absolute";
  textBoxFireOverlay.style.top = "0";
  textBoxFireOverlay.style.left = "0";
  textBoxFireOverlay.style.width = "100%";
  textBoxFireOverlay.style.height = "100%";
  textBoxFireOverlay.style.backgroundImage = "url('fire.gif')";
  textBoxFireOverlay.style.backgroundSize = "cover";
  textBoxFireOverlay.style.backgroundPosition = "center";
  textBoxFireOverlay.style.opacity = "0";
  textBoxFireOverlay.style.pointerEvents = "none";
  textBoxFireOverlay.style.zIndex = "5";
  textBoxFireOverlay.style.transition = "opacity 0.6s ease";
  
  // Append the fire overlay to messageInput's parent with positioning
  messageInput.parentElement.style.position = "relative";
  messageInput.parentElement.appendChild(textBoxFireOverlay);

  // Create a form-wide fire overlay element
  const formFireOverlay = document.createElement("div");
  formFireOverlay.className = "form-fire-overlay";
  formFireOverlay.style.position = "absolute";
  formFireOverlay.style.top = "0";
  formFireOverlay.style.left = "0";
  formFireOverlay.style.width = "100%";
  formFireOverlay.style.height = "100%";
  formFireOverlay.style.backgroundImage = "url('fire.gif')";
  formFireOverlay.style.backgroundSize = "cover";
  formFireOverlay.style.backgroundPosition = "center";
  formFireOverlay.style.opacity = "0";
  formFireOverlay.style.pointerEvents = "none";
  formFireOverlay.style.zIndex = "10";
  formFireOverlay.style.transition = "opacity 0.6s ease";

  // Make sure confessionForm has relative positioning to contain the overlay
  confessionForm.style.position = "relative";
  confessionForm.appendChild(formFireOverlay);
  
  // Audio files for website - KEEPING ORIGINAL IMPLEMENTATION
  const burnSound = new Audio("fire.mp3");
  burnSound.volume = 0.5;

  // Setup audio context and track once to avoid re-creation errors
  let audioContext;
  let track;
  
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    track = audioContext.createMediaElementSource(burnSound);
    track.connect(audioContext.destination);
  } catch (e) {
    console.warn("Audio context creation failed:", e);
  }

  // Fire-only background animation 
  const glowEffect = () => {
    fireAnimation.classList.add("active");
    screenGlow.classList.add("active");
    
    setTimeout(() => {
      fireAnimation.classList.remove("active");
      screenGlow.classList.remove("active");
    }, 1200);
  };

  // Function to reset form fields to defaults
  function resetFormFields() {
    messageInput.value = "";
    genderSelect.value = ""; // Reset to default "Select" option
    ageSelect.value = ""; // Reset to default "Select" option
    dateSelect.value = ""; // Reset to default date format
    
    // Update word count
    wordCountDisplay.textContent = "0 words";
    
    // Hide clear button
    clearButton.classList.add("hidden");
  }

  // Core burn logic - UPDATED TO INCLUDE FORM-WIDE FIRE ANIMATION
  function burnMessage(e) {
    if (e) e.preventDefault();
    
    if (!messageInput.value.trim()) {
      errorMsg.style.display = "block";
      return;
    }
    
    errorMsg.style.display = "none";

    // Get demographics data ONLY - message is not included
    const confessionData = {
      timestamp: Date.now(),
      gender: genderSelect.value || "unspecified",
      age: ageSelect.value || "unspecified",
      date: dateSelect.value || new Date().toISOString().split('T')[0]
    };

    // Show both fire animations - text box and form-wide
    textBoxFireOverlay.style.opacity = "1";
    formFireOverlay.style.opacity = "1";

    // Use existing audioContext and track 
    if (audioContext) {
      audioContext.resume().then(() => {
        burnSound.currentTime = 0; // restart audio from beginning
        burnSound.play().catch(err => console.warn("Audio play failed:", err));
      }).catch(e => console.warn("Audio context resume failed:", e));
    } else {
      // Fallback if audio context failed
      burnSound.currentTime = 0;
      burnSound.play().catch(err => console.warn("Audio play failed:", err));
    }
    
    // Show the fire animation
    glowEffect();
    
    // Save demographic data to Firebase (no message)
    saveConfession(confessionData);

    // Hide the fire animations and reset form fields after the animation completes
    setTimeout(() => {
      textBoxFireOverlay.style.opacity = "0";
      formFireOverlay.style.opacity = "0";
      // Reset form fields after the animation
      resetFormFields();
    }, 1200); 

    // Update counter
    setTimeout(() => {
      updateCounter();
    }, 600); 
  }

  // Event listeners for burn
  confessionForm.addEventListener("submit", burnMessage);
  
  // Keep your original keyboard shortcut for burning
  messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      burnMessage();
    }
  });

  messageInput.addEventListener("input", function() {
    let text = messageInput.value.trim();

    if(text === "") {
      wordCountDisplay.textContent = "0 words";
      clearButton.classList.add("hidden");
      return;
    }
    let words = text.split(/\s+/).length;
    wordCountDisplay.textContent = words + (words === 1 ? " word" : " words");
  
    // Show the clear button
    clearButton.classList.remove("hidden");
  })
  
  messageInput.addEventListener("focus", () => {
    errorMsg.style.display = "none";
  });

  // Clear button functionality
  if (clearButton) {
    clearButton.addEventListener("click", function() {
      messageInput.value = "";
      wordCountDisplay.textContent = "0 words";
      clearButton.classList.add("hidden");
    });
  }

  // 🎤 Speech-to-Text Functionality
  let recognition;
  let isListening = false;

  // Grab language selector
  const languageSelect = document.getElementById("languageSelect");

  micButton.addEventListener("click", () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    if (!recognition) {
      recognition = new SpeechRecognition();
      recognition.lang = languageSelect.value;
      recognition.interimResults = false;
      recognition.continuous = true;

      recognition.onresult = function (event) {
        const transcript = event.results[event.results.length - 1][0].transcript;
        messageInput.value += (messageInput.value ? " " : "") + transcript;
        
        // Update word count display
        let text = messageInput.value.trim();
        let words = text.split(/\s+/).length;
        wordCountDisplay.textContent = words + (words === 1 ? " word" : " words");
        
        // Show clear button when there's text
        if (text !== "") {
          clearButton.classList.remove("hidden");
        }
      };

      recognition.onerror = function (event) {
        console.error("Speech recognition error:", event.error);
        isListening = false;
        micButton.textContent = "🎤";
      };

      recognition.onend = function () {
        if (isListening) recognition.start();
      };
    } else {
      recognition.lang = languageSelect.value;
    }

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

  // Firebase Functions
  function initializeCounter() {
    try {
      const countRef = window.firebaseRef(window.firebaseDb, 'confessionCount');
      window.firebaseOnValue(countRef, (snapshot) => {
        const count = snapshot.val() || 0;
        confessionCount = count;
        counterSpan.textContent = count;
      });
    } catch (e) {
      console.error("Error initializing counter:", e);
    }
  }

  function updateCounter() {
    try {
      confessionCount++;
      counterSpan.textContent = confessionCount;
      window.firebaseSet(window.firebaseRef(window.firebaseDb, 'confessionCount'), confessionCount);
    } catch (e) {
      console.error("Error updating counter:", e);
    }
  }

  function saveConfession(data) {
    try {
      const confessionsRef = window.firebasePush(window.firebaseRef(window.firebaseDb, 'confessions'));
      window.firebaseSet(confessionsRef, data);
      
      // Update statistics for charts
      updateStatistics(data);
    } catch (e) {
      console.error("Error saving confession:", e);
    }
  }
  
  // Chart Functionality
  const chartsLoading = document.getElementById("chartsLoading");
  let genderChart, ageChart, dateChart;
  let statsData = {
    genders: {},
    ages: {},
    dates: {}
  };

  // Initialize Charts
  initializeCharts();
  loadStatistics();

  function initializeCharts() {
    // Configure Chart.js global settings
    Chart.defaults.color = '#d0d0d0';
    Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    
    // Common options for all charts
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            color: '#d0d0d0'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(40, 40, 40, 0.9)',
          titleColor: '#ff9800',
          bodyColor: '#ffffff',
          borderColor: 'rgba(255, 107, 8, 0.3)',
          borderWidth: 1
        }
      }
    };

    // Gender Chart
    const genderCtx = document.getElementById('genderChart').getContext('2d');
    genderChart = new Chart(genderCtx, {
      type: 'pie',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [
            '#ff6b08', '#fb8c00', '#f57c00', '#ef6c00', '#e65100', '#ffb74d'
          ],
          borderWidth: 1,
          borderColor: '#1f1f1f'
        }]
      },
      options: chartOptions
    });

    // Age Chart
    const ageCtx = document.getElementById('ageChart').getContext('2d');
    ageChart = new Chart(ageCtx, {
      type: 'pie',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [
            '#ff6b08', '#fb8c00', '#f57c00', '#ef6c00', '#e65100', '#ffb74d'
          ],
          borderWidth: 1,
          borderColor: '#1f1f1f'
        }]
      },
      options: chartOptions
    });

    // Date Chart
    const dateCtx = document.getElementById('dateChart').getContext('2d');
    dateChart = new Chart(dateCtx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Confessions by Date',
          data: [],
          backgroundColor: 'rgba(255, 107, 8, 0.6)',
          borderColor: '#ff6b08',
          borderWidth: 1
        }]
      },
      options: {
        ...chartOptions,
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#d0d0d0'
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#d0d0d0'
            }
          }
        }
      }
    });
  }

  function loadStatistics() {
    try {
      const statsRef = window.firebaseRef(window.firebaseDb, 'statistics');
      window.firebaseOnValue(statsRef, (snapshot) => {
        const stats = snapshot.val();
        if (stats) {
          statsData = stats;
          updateCharts();
          chartsLoading.style.display = 'none';
        } else {
          // Initialize default statistics
          window.firebaseSet(statsRef, statsData);
        }
      });
    } catch (e) {
      console.error("Error loading statistics:", e);
      // Show a simple interface if Firebase fails
      chartsLoading.textContent = "Statistics currently unavailable";
    }
  }

  function updateStatistics(confessionData) {
    // Update gender stats
    const gender = confessionData.gender || 'unspecified';
    if (!statsData.genders[gender]) {
      statsData.genders[gender] = 1;
    } else {
      statsData.genders[gender]++;
    }
    
    // Update age stats
    const age = confessionData.age || 'unspecified';
    if (!statsData.ages[age]) {
      statsData.ages[age] = 1;
    } else {
      statsData.ages[age]++;
    }
    
    // Update date stats
    const date = confessionData.date || new Date().toISOString().split('T')[0];
    if (!statsData.dates[date]) {
      statsData.dates[date] = 1;
    } else {
      statsData.dates[date]++;
    }
    
    // Save updated stats to Firebase
    try {
      window.firebaseSet(window.firebaseRef(window.firebaseDb, 'statistics'), statsData);
      updateCharts();
    } catch (e) {
      console.error("Error updating statistics:", e);
    }
  }

  function updateCharts() {
    // Gender Chart Update
    const genderLabels = Object.keys(statsData.genders);
    const genderData = genderLabels.map(key => statsData.genders[key]);
    
    genderChart.data.labels = genderLabels.map(label => {
      if (label === 'unspecified') return 'Unspecified';
      return label.charAt(0).toUpperCase() + label.slice(1);
    });
    genderChart.data.datasets[0].data = genderData;
    genderChart.update();
    
    // Age Chart Update
    const ageLabels = Object.keys(statsData.ages);
    const ageData = ageLabels.map(key => statsData.ages[key]);
    
    ageChart.data.labels = ageLabels.map(label => {
      if (label === 'unspecified') return 'Unspecified';
      return label.charAt(0).toUpperCase() + label.slice(1).replace('-', ' to ');
    });
    ageChart.data.datasets[0].data = ageData;
    ageChart.update();
    
    // Date Chart Update
    const dateLabels = Object.keys(statsData.dates).sort();
    const dateData = dateLabels.map(key => statsData.dates[key]);
    
    // Only show the most recent 7 dates
    const recentDateLabels = dateLabels.slice(-10);
    const recentDateData = dateData.slice(-10);
    
    dateChart.data.labels = recentDateLabels.map(date => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    dateChart.data.datasets[0].data = recentDateData;
    dateChart.update();
  }

  // Test Firebase Connection
  window.testFirebaseConnection = function() {
    try {
      const testRef = window.firebaseRef(window.firebaseDb, 'test');
      window.firebaseSet(testRef, { timestamp: Date.now() })
        .then(() => alert("Firebase connection successful!"))
        .catch(error => alert("Firebase error: " + error.message));
    } catch (e) {
      alert("Firebase initialization error: " + e.message);
    }
  };
});

document.addEventListener("DOMContentLoaded", function () {
  const showSurveyText = document.getElementById("showSurveyText");
  const showSurveyBtn = document.getElementById("showSurveyBtn");
  const demographicsContainer = document.querySelector(".demographics-container");

  if (showSurveyBtn && demographicsContainer) {
    showSurveyBtn.addEventListener("click", () => {
      demographicsContainer.style.display = "flex";
      showSurveyBtn.style.display = "none"; // hide the button
      showSurveyText.style.display = "none"; // hide the text
    });
  }
  
  const clearButton = document.getElementById("clearButton");
  const messageInput = document.getElementById("messageInput");
  
  if (messageInput && clearButton) {
    messageInput.addEventListener("input", () => {
      if (messageInput.value.trim() !== "") {
        clearButton.classList.remove("hidden");
      } else {
        clearButton.classList.add("hidden");
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const statsSection = document.getElementById('statsSection');
  const toggleStatsBtn = document.getElementById('toggleStatsBtn');

  if (statsSection && toggleStatsBtn) {
    // Initially hide the stats section
    statsSection.style.display = 'none';

    toggleStatsBtn.addEventListener('click', () => {
      const isVisible = statsSection.style.display === 'block';

      statsSection.style.display = isVisible ? 'none' : 'block';
      toggleStatsBtn.textContent = isVisible ? 'Show Statistics' : 'Hide Statistics';
    });
  }
});