/**
 * Main Navigation Functionality
 */
const NavigationModule = (() => {
  const initNavigation = () => {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');

    if (navToggle) {
      navToggle.addEventListener('click', () => navMenu.classList.add('show-menu'));
    }

    if (navClose) {
      navClose.addEventListener('click', () => navMenu.classList.remove('show-menu'));
    }

    const navLinks = document.querySelectorAll('.nav__link');
    const linkAction = () => navMenu.classList.remove('show-menu');
    navLinks.forEach(link => link.addEventListener('click', linkAction));
  };

  return { init: initNavigation };
})();

/**
 * Video Player Functionality
 */
const VideoModule = (() => {
  const initBackgroundVideo = () => {
    const video = document.getElementById('myVideo');
    if (video) {
      video.play().catch(error => {
        console.log("Video play failed:", error);
      });
    }
  };

  return { initBackgroundVideo };
})();

/**
 * Contact Form Module
 */
const ContactFormModule = (() => {
  const handleFormSubmit = event => {
    event.preventDefault();

    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('form-success');
    
    const name = form.querySelector('[name="name"]').value;
    const email = form.querySelector('[name="email"]').value;
    const message = form.querySelector('[name="message"]').value;
    
    if (!name || !email || !message) {
      alert('Please fill all fields');
      return;
    }
    
    successMessage.style.display = 'block';
    
    setTimeout(() => {
      form.reset();
    }, 100);
    
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 5000);
    
    // Server submission code would go here in production
  };

  const initContactForm = () => {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', handleFormSubmit);
      
      let successMsg = document.getElementById('form-success');
      if (!successMsg) {
        successMsg = document.createElement('div');
        successMsg.id = 'form-success';
        successMsg.textContent = 'Thank you! Your message has been sent successfully.';
        successMsg.style.display = 'none';
        contactForm.appendChild(successMsg);
      }
    }
  };

  return { init: initContactForm };
})();

/**
 * YouTube Video Module
 */
const YouTubeModule = (() => {
  // Module state
  const state = {
    apiLoaded: false,
    playerObjects: [],
    currentSlideIndex: 0,
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  };

  const loadAPI = () => {
    if (!state.apiLoaded && typeof YT === 'undefined') {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      state.apiLoaded = true;
      console.log('YouTube API script added');
    }
  };

  const initializePlayers = () => {
    // Clear existing players
    state.playerObjects = [];
    
    // Find all slides with YouTube iframes
    const slides = document.querySelectorAll('.rec-swiper-slide');
    
    slides.forEach((slide, index) => {
      const iframe = slide.querySelector('iframe.video-player');
      
      if (!iframe) return;
      
      // Extract video ID from iframe src
      const src = iframe.src;
      const match = src.match(/embed\/([^?]+)/);
      
      if (!match || !match[1]) return;
      
      const videoId = match[1];
      const playerId = 'youtube-player-' + index;
      
      // Replace iframe with div that will be used by YouTube API
      const playerDiv = document.createElement('div');
      playerDiv.id = playerId;
      playerDiv.classList.add('video-player');
      
      iframe.parentNode.replaceChild(playerDiv, iframe);
      
      try {
        const playerVars = {
          'playsinline': 1,
          'rel': 0,
          'showinfo': 0,
          'controls': 1,
          'enablejsapi': 1,
          'origin': window.location.origin,
          'modestbranding': 1
        };
        
        // Add additional parameters for mobile
        if (state.isMobile) {
          playerVars.autoplay = 0;
          playerVars.fs = 1;
        }
        
        const player = new YT.Player(playerId, {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: playerVars,
          events: {
            'onReady': event => {
              console.log('Player ready', playerId);
              
              // Add click event to player for mobile
              if (state.isMobile) {
                const playerElement = document.getElementById(playerId);
                if (playerElement) {
                  const videoWrapper = playerElement.closest('.video-wrapper');
                  if (videoWrapper) {
                    videoWrapper.addEventListener('click', e => {
                      e.stopPropagation();
                      console.log('Player clicked, attempting to play');
                      
                      pauseAllVideosExcept(index);
                      
                      try {
                        player.playVideo();
                      } catch (err) {
                        console.error('Error playing video:', err);
                      }
                    }, { passive: false });
                  }
                }
              }
            },
            'onStateChange': event => {
              if (event.data === YT.PlayerState.PLAYING) {
                console.log('Video started playing:', playerId);
                pauseAllVideosExcept(index);
              }
            },
            'onError': event => {
              console.error('YouTube player error:', event.data);
            }
          }
        });
        
        state.playerObjects.push(player);
      } catch (err) {
        console.error('Error creating YouTube player:', err);
        
        // Restore the original iframe if player creation fails
        const newIframe = document.createElement('iframe');
        newIframe.src = src;
        newIframe.classList.add('video-player');
        newIframe.setAttribute('frameborder', '0');
        newIframe.setAttribute('allowfullscreen', '');
        newIframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        
        playerDiv.parentNode.replaceChild(newIframe, playerDiv);
      }
    });
  };

  const pauseAllVideosExcept = activeIndex => {
    state.playerObjects.forEach((player, index) => {
      if (index !== activeIndex && player && typeof player.pauseVideo === 'function') {
        try {
          player.pauseVideo();
        } catch (err) {
          console.error('Error pausing video:', err);
        }
      }
    });
  };

  const pauseAllVideos = () => {
    if (state.playerObjects.length > 0) {
      state.playerObjects.forEach(player => {
        if (player && typeof player.pauseVideo === 'function') {
          try {
            player.pauseVideo();
          } catch (err) {
            console.error('Error pausing video:', err);
          }
        }
      });
    } else {
      // Fallback method for when YouTube API isn't loaded
      const iframes = document.querySelectorAll('.rec-video-container .video-player');
      iframes.forEach(iframe => {
        try {
          if (iframe.tagName === 'IFRAME') {
            const currentSrc = iframe.src;
            iframe.src = currentSrc;
          }
        } catch (err) {
          console.error('Error handling iframe:', err);
        }
      });
    }
  };

  const reloadAllPlayers = () => {
    state.playerObjects.forEach((player, index) => {
      if (player && typeof player.destroy === 'function') {
        try {
          player.destroy();
        } catch (err) {
          console.error('Error destroying player:', err);
        }
      }
    });
    
    state.playerObjects = [];
    
    setTimeout(() => {
      initializePlayers();
    }, 100);
  };

  const showSlide = index => {
    const slides = document.querySelectorAll('.rec-swiper-slide');
    const totalSlides = slides.length;
    
    // Ensure index is within bounds
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    
    // Update current slide index
    state.currentSlideIndex = index;
    
    // Hide all slides
    slides.forEach(slide => {
      slide.style.display = 'none';
    });
    
    // Show the current slide
    slides[index].style.display = 'block';
    
    // Pause all videos
    pauseAllVideos();
    
    // Add fade-in animation
    const currentSlide = slides[index];
    currentSlide.style.opacity = '0';
    currentSlide.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      currentSlide.style.transition = 'opacity 0.5s, transform 0.5s';
      currentSlide.style.opacity = '1';
      currentSlide.style.transform = 'scale(1)';
    }, 50);
  };

  const initRecommendedVideos = () => {
    const prevBtn = document.querySelector('.rec-button-prev');
    const nextBtn = document.querySelector('.rec-button-next');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        showSlide(state.currentSlideIndex - 1);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        showSlide(state.currentSlideIndex + 1);
      });
    }
    
    // Add special handling for mobile devices
    if (state.isMobile) {
      // Enable touch swipe for mobile
      const videoContainer = document.querySelector('.rec-video-container');
      
      if (videoContainer) {
        let startX = 0;
        let endX = 0;
        
        videoContainer.addEventListener('touchstart', e => {
          startX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        videoContainer.addEventListener('touchend', e => {
          endX = e.changedTouches[0].screenX;
          
          // Determine swipe direction
          if (startX - endX > 50) {
            // Swipe left, show next
            showSlide(state.currentSlideIndex + 1);
          } else if (endX - startX > 50) {
            // Swipe right, show previous
            showSlide(state.currentSlideIndex - 1);
          }
        }, { passive: true });
      }
      
      // Add specific touch handlers for iOS
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        document.addEventListener('touchstart', () => {
          // This helps with iOS requiring initial interaction
          console.log('Document touch start - iOS compatibility');
        }, { passive: true, once: true });
      }
    }
    
    // Show first slide initially
    showSlide(0);
  };

  const setupScrollHandler = () => {
    document.addEventListener('scroll', () => {
      const container3 = document.querySelector('.container-3');
      
      if (container3) {
        const containerRect = container3.getBoundingClientRect();
        const isVisible = (
          containerRect.top < window.innerHeight &&
          containerRect.bottom > 0
        );
        
        // If container is not visible, pause all videos
        if (!isVisible) {
          pauseAllVideos();
        }
      }
    }, { passive: true });
  };

  const handleWindowResize = () => {
    window.addEventListener('resize', () => {
      // Small delay to ensure everything is properly resized first
      setTimeout(() => {
        showSlide(state.currentSlideIndex);
      }, 300);
    }, { passive: true });
  };

  return {
    init: () => {
      loadAPI();
      initRecommendedVideos();
      setupScrollHandler();
      handleWindowResize();
      
      // Force video load if on mobile
      if (state.isMobile) {
        document.addEventListener('click', () => {
          if (!state.apiLoaded) {
            loadAPI();
          }
        }, { passive: true, once: true });
      }
    },
    showSlide,
    pauseAllVideos,
    reloadAllPlayers
  };
})();

/**
 * Animation Module
 */
const AnimationModule = (() => {
  const initGSAPAnimations = () => {
    if (typeof gsap === 'undefined') return;

    gsap.from(".box-container", {
      duration: 1,
      opacity: 0,
      scale: 0.5,
      stagger: 0.2,
      delay: 0.5,
      ease: "power3.out"
    });

    gsap.from(".nav__social-links", {
      duration: 1.5,
      opacity: 0,
      y: -20,
      stagger: 0.3,
      ease: "elastic.out",
      delay: 1
    });

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      gsap.from(".team-container", {
        duration: 1.2,
        opacity: 0,
        y: 50,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".team-container",
          start: "top 80%"
        }
      });

      // Container1 elements
      gsap.from('.container1__title, .container1__description, .container1__info, .container1__button, .container1__image', {
        scrollTrigger: {
          trigger: '.container1',
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1,
        },
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8
      });
      
      // Container2 elements
      gsap.from('.container2__title, .container2__subtitle, .container2__description, .container2__info, .container2__button, .container2__image', {
        scrollTrigger: {
          trigger: '.container2',
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1,
        },
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8
      });
      
      // Container3 elements
      gsap.from('.recommended-title, .recommended-content, .rec-video-container, .subtitle', {
        scrollTrigger: {
          trigger: '.container-3',
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1,
        },
        y: 30,
        opacity: 0,
        stagger: 0.3,
        duration: 0.8
      });
      
      // About us elements
      gsap.from('.about-us__title, .about-us__content, .about-us__description , .about-us__info , .about-us__button, .about-us__image', {
        scrollTrigger: {
          trigger: '.about-us',
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1,
        },
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8
      });
    }
  };

  const initMobileVideoSupport = () => {
    const html5Videos = document.querySelectorAll('video');
    html5Videos.forEach(video => {
      video.setAttribute('playsinline', '');
      video.setAttribute('controls', '');
      
      // Add click to play for iOS
      video.addEventListener('click', () => {
        if (video.paused) {
          video.play().catch(err => console.error('Video play error:', err));
        } else {
          video.pause();
        }
      });
    });
  };

  return {
    init: () => {
      initGSAPAnimations();
      initMobileVideoSupport();
    }
  };
})();

/**
 * YouTube API callback
 */
window.onYouTubeIframeAPIReady = function() {
  console.log('YouTube API Ready');
  YouTubeModule.reloadAllPlayers();
};

/**
 * Initialize all modules when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  try {
    NavigationModule.init();
    VideoModule.initBackgroundVideo();
    ContactFormModule.init();
    YouTubeModule.init();
    AnimationModule.init();
  } catch (error) {
    console.error('Initialization error:', error);
  }
});