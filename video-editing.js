/* ==========================================================================
   Saltea Studio - Video Editing Page Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initVideoBgCanvas();
  initCurvedCarousel();
  initMagneticElements();
  initScrollReveal();
  initLightbox();
});

/* --------------------------------------------------------------------------
   1. Navbar Scroll Transition
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}

/* --------------------------------------------------------------------------
   2. Mobile Hamburger Drawer Menu
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-menu-link');

  if (!hamburgerBtn || !mobileMenu) return;

  const toggleMenu = () => {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const openMenu = () => {
    hamburgerBtn.classList.add('active');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    hamburgerBtn.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburgerBtn.addEventListener('click', toggleMenu);
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}


/* --------------------------------------------------------------------------
   4. Magnetic Button/Link Attraction
   -------------------------------------------------------------------------- */
function initMagneticElements() {
  const elements = document.querySelectorAll('.cta-button, .nav-link, .logo');

  elements.forEach(element => {
    let initialCenterX = 0;
    let initialCenterY = 0;

    element.addEventListener('mouseenter', () => {
      if (element._magneticTimeout) {
        clearTimeout(element._magneticTimeout);
      }
      
      const rect = element.getBoundingClientRect();
      initialCenterX = rect.left + rect.width / 2 + window.scrollX;
      initialCenterY = rect.top + rect.height / 2 + window.scrollY;
      
      element.style.transition = 'transform 0.12s cubic-bezier(0.25, 1, 0.5, 1)';
    });

    element.addEventListener('mousemove', (e) => {
      const mousePageX = e.clientX + window.scrollX;
      const mousePageY = e.clientY + window.scrollY;
      
      const deltaX = mousePageX - initialCenterX;
      const deltaY = mousePageY - initialCenterY;
      
      const pullFactor = 0.28;
      const maxPull = 12;
      
      let tx = deltaX * pullFactor;
      let ty = deltaY * pullFactor;
      
      const dist = Math.sqrt(tx * tx + ty * ty);
      if (dist > maxPull) {
        tx = (tx / dist) * maxPull;
        ty = (ty / dist) * maxPull;
      }
      
      element.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });

    element.addEventListener('mouseleave', () => {
      element.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      element.style.transform = 'translate3d(0, 0, 0)';
      
      element._magneticTimeout = setTimeout(() => {
        element.style.transform = '';
        element.style.transition = '';
      }, 500);
    });
  });
}

/* --------------------------------------------------------------------------
   5. Scroll Reveal animations
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, self) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        self.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    observer.observe(el);
  });
}

/* --------------------------------------------------------------------------
   6. Background Canvas (Gaseous Blobs matching blue-purple-black theme)
   -------------------------------------------------------------------------- */
function initVideoBgCanvas() {
  const canvas = document.getElementById('video-bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;

  let mouseX = -1000;
  let mouseY = -1000;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  const blobs = [
    {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: 0.12,
      vy: 0.18,
      r: 350,
      color: 'rgba(226, 226, 232, 0.06)' // soft silver glow
    },
    {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: -0.18,
      vy: 0.12,
      r: 420,
      color: 'rgba(200, 200, 220, 0.05)' // soft gray-silver glow
    },
    {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: 0.15,
      vy: -0.15,
      r: 390,
      color: 'rgba(255, 255, 255, 0.04)' // soft white glow
    }
  ];

  function draw() {
    ctx.clearRect(0, 0, width, height);

    blobs.forEach(blob => {
      blob.x += blob.vx;
      blob.y += blob.vy;

      if (blob.x < -blob.r) blob.vx = Math.abs(blob.vx);
      if (blob.x > width + blob.r) blob.vx = -Math.abs(blob.vx);
      if (blob.y < -blob.r) blob.vy = Math.abs(blob.vy);
      if (blob.y > height + blob.r) blob.vy = -Math.abs(blob.vy);

      if (mouseX !== -1000) {
        const dx = blob.x - mouseX;
        const dy = blob.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 400) {
          const force = (400 - dist) * 0.03;
          const angle = Math.atan2(dy, dx);
          blob.x += Math.cos(angle) * force;
          blob.y += Math.sin(angle) * force;
        }
      }

      const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
      gradient.addColorStop(0, blob.color);
      gradient.addColorStop(0.5, blob.color.replace(/[\d.]+\)$/, '0.03)'));
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  draw();
}

/* --------------------------------------------------------------------------
   7. Curved / 3D Horizontal Card Carousel (Infinite Scroll & U-Shape Curve)
   -------------------------------------------------------------------------- */
function initCurvedCarousel() {
  const container = document.getElementById('carousel-container');
  const track = document.getElementById('carousel-track');
  let cards = document.querySelectorAll('.carousel-card');

  if (!container || !track || cards.length === 0) return;

  // Clone elements to enable seamless infinite wrapping
  const originalCards = Array.from(cards);
  
  // Clone cards to prepend and append
  const clonesBefore = originalCards.map(card => card.cloneNode(true));
  const clonesAfter = originalCards.map(card => card.cloneNode(true));
  
  clonesBefore.forEach(clone => {
    clone.classList.add('clone');
    track.insertBefore(clone, track.firstChild);
  });
  
  clonesAfter.forEach(clone => {
    clone.classList.add('clone');
    track.appendChild(clone);
  });
  
  // Re-query cards to include all clones
  cards = document.querySelectorAll('.carousel-card');

  // Measure the cycle width (distance between the 1st card of set 1 and 1st card of set 2)
  const cardCount = originalCards.length;
  let setWidth = 0;
  
  const measureSetWidth = () => {
    if (cards.length > cardCount) {
      setWidth = cards[cardCount].offsetLeft - cards[0].offsetLeft;
    }
  };
  measureSetWidth();

  // Render updates based on scroll position
  const updateCardTransforms = () => {
    const containerRect = container.getBoundingClientRect();
    const containerCenterX = containerRect.left + containerRect.width / 2;
    const maxDistance = containerRect.width / 2;

    let closestCard = null;
    let minDistance = Infinity;

    cards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const distance = cardCenterX - containerCenterX;
      
      // Normalize distance relative to half of the container width
      let normDistance = distance / maxDistance;
      normDistance = Math.max(-1.5, Math.min(1.5, normDistance));

      // Calculate transformations matching a hanging garland U-curve (lowest in center, rising to the sides)
      const translateY = -Math.pow(normDistance, 2) * 110; 
      
      // Z-rotation slants cards towards the center
      const rotateZ = normDistance * -16;
      
      // Y-rotation creates a 3D cylindrical wrap-around perspective facing the center
      const rotateY = normDistance * -15;
      
      // Cards scale down as they move to the edges
      const scale = 1 - (Math.pow(normDistance, 2) * 0.08);
      
      // Opacity goes down on the edges
      const opacity = 1 - (Math.pow(normDistance, 2) * 0.25);
      const clampedOpacity = Math.max(0.65, Math.min(1.0, opacity));

      // Apply transformations to CSS variables
      card.style.setProperty('--card-translate-y', `${translateY}px`);
      card.style.setProperty('--card-rotate-z', `${rotateZ}deg`);
      card.style.setProperty('--card-rotate-y', `${rotateY}deg`);
      card.style.setProperty('--card-scale', `${scale}`);
      card.style.setProperty('--card-opacity', `${clampedOpacity}`);

      // Track center card
      const absDistance = Math.abs(distance);
      if (absDistance < minDistance) {
        minDistance = absDistance;
        closestCard = card;
      }
    });

    // Toggle active state
    cards.forEach(card => {
      if (card === closestCard) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  };

  // Scroll handler that handles wrapping and updates transforms
  const handleScroll = () => {
    if (setWidth === 0) return;
    
    const currentScroll = container.scrollLeft;
    
    // Wrap around left
    if (currentScroll < setWidth) {
      container.scrollLeft += setWidth;
    } 
    // Wrap around right
    else if (currentScroll >= setWidth * 2) {
      container.scrollLeft -= setWidth;
    }
    
    updateCardTransforms();
  };

  container.addEventListener('scroll', handleScroll, { passive: true });
  
  window.addEventListener('resize', () => {
    measureSetWidth();
    handleScroll();
  }, { passive: true });

  // ---------------------------------------------------------
  // Drag to Scroll + Momentum (Inertia) Implementation
  // ---------------------------------------------------------
  let isDown = false;
  
  // Kinetic scroll physics variables
  let velocity = 0;
  let lastX = 0;
  let lastTime = 0;
  let animationFrameId = null;

  const startDrag = (e) => {
    isDown = true;
    isInertiaActive = false;
    container.classList.add('dragging');
    
    // Stop any active inertia animation
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    
    velocity = 0;
    lastX = e.pageX || e.touches[0].pageX;
    lastTime = performance.now();
  };

  const stopDrag = () => {
    if (!isDown) return;
    isDown = false;
    container.classList.remove('dragging');
    
    // Trigger inertia/momentum scroll
    if (Math.abs(velocity) > 0.5) {
      applyInertia();
    }
  };

  const dragMove = (e) => {
    if (!isDown) return;
    e.preventDefault();

    const currentX = e.pageX || e.touches[0].pageX;
    const dx = currentX - lastX;
    
    // Scroll container relatively
    container.scrollLeft -= dx * 1.5;

    // Calculate instantaneous velocity
    const currentTime = performance.now();
    const dt = currentTime - lastTime;
    
    if (dt > 0) {
      velocity = -dx / dt;
    }

    lastX = currentX;
    lastTime = currentTime;
  };

  const applyInertia = () => {
    if (Math.abs(velocity) < 0.15) {
      cancelAnimationFrame(animationFrameId);
      isInertiaActive = false;
      return;
    }

    isInertiaActive = true;
    container.scrollLeft += velocity * 16;
    velocity *= 0.92; // Friction factor

    animationFrameId = requestAnimationFrame(applyInertia);
  };

  // Mouse drag listeners
  container.addEventListener('mousedown', startDrag);
  container.addEventListener('mouseleave', stopDrag);
  container.addEventListener('mouseup', stopDrag);
  container.addEventListener('mousemove', dragMove);

  // Touch drag listeners
  container.addEventListener('touchstart', startDrag, { passive: true });
  container.addEventListener('touchend', stopDrag, { passive: true });
  container.addEventListener('touchmove', dragMove, { passive: false });

  // Initial call to center the carousel to set 2 (middle) and start autoscrolling
  let isInertiaActive = false;
  
  // ---------------------------------------------------------
  // Smooth Autoscroll Implementation
  // ---------------------------------------------------------
  const autoScrollSpeed = 0.55; // Smooth cinematic scroll speed
  let autoScrollFrameId = null;
  let isHovered = false;

  const autoScroll = () => {
    if (!isDown && !isHovered && !isInertiaActive) {
      container.scrollLeft += autoScrollSpeed;
    }
    autoScrollFrameId = requestAnimationFrame(autoScroll);
  };

  container.addEventListener('mousemove', (e) => {
    isHovered = !!e.target.closest('.carousel-card');
  });

  container.addEventListener('mouseleave', () => {
    isHovered = false;
  });

  container.addEventListener('touchstart', () => {
    isHovered = true;
  }, { passive: true });

  container.addEventListener('touchend', () => {
    isHovered = false;
  }, { passive: true });

  setTimeout(() => {
    measureSetWidth();
    if (setWidth > 0) {
      container.scrollLeft = setWidth;
    }
    updateCardTransforms();
    
    // Start autoscrolling after centering
    autoScrollFrameId = requestAnimationFrame(autoScroll);
  }, 100);
}

/* --------------------------------------------------------------------------
   8. Lightbox modal for expanding cards to original size on click
   -------------------------------------------------------------------------- */
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  const cards = document.querySelectorAll('.carousel-card');

  if (!modal || !modalImg || !closeBtn || cards.length === 0) return;

  let startX = 0;
  let startY = 0;

  cards.forEach(card => {
    card.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      startY = e.clientY;
    });

    card.addEventListener('mouseup', (e) => {
      const diffX = Math.abs(e.clientX - startX);
      const diffY = Math.abs(e.clientY - startY);

      // If the cursor moved less than 5px during mouse hold, treat as click
      if (diffX < 5 && diffY < 5) {
        const img = card.querySelector('img');
        if (img) {
          modalImg.src = img.src;
          modalImg.alt = img.alt;
          modal.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      }
    });

    // Touch support
    card.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    }, { passive: true });

    card.addEventListener('touchend', (e) => {
      if (e.changedTouches.length > 0) {
        const diffX = Math.abs(e.changedTouches[0].clientX - startX);
        const diffY = Math.abs(e.changedTouches[0].clientY - startY);

        if (diffX < 5 && diffY < 5) {
          const img = card.querySelector('img');
          if (img) {
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
          }
        }
      }
    }, { passive: true });
  });

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      modalImg.src = '';
    }, 400);
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-content')) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}
