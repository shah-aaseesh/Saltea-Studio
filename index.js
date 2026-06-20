/* ==========================================================================
   Saltea Studio Core Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollPerformance();
  initHeroCanvas();
  initTicketsTilt();
  initTicketTear();
  initFAQAccordion();
  initGalleryFilter();
  initScrollReveal();
  initContactCanvas();
  initMarketingCanvas();
  initSpotlightCards();
  initMagneticElements();
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

  // Run once on load, then attach listener
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}

/* --------------------------------------------------------------------------
   1.5. Mobile Hamburger Drawer Menu
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
    document.body.style.overflow = 'hidden'; // Prevent scroll under drawer
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
   2. Scroll Performance & Anti Scroll-Hijack
   -------------------------------------------------------------------------- */
function initScrollPerformance() {
  const viewer = document.querySelector('.spline-viewer-element, .spline-iframe');
  if (!viewer) return;

  // Mobile/Touch optimization: Disable pointer events on touch viewports so users can swipe-scroll normally
  const isMobileOrTouch = window.matchMedia('(max-width: 768px)').matches || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isMobileOrTouch) {
    viewer.style.pointerEvents = 'none';
  }

  // Desktop optimization: Add 'is-scrolling' class during scrolling to prevent iframe scroll-hijacking
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    document.body.classList.add('is-scrolling');
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      document.body.classList.remove('is-scrolling');
    }, 150);
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   2. 3D Tilt Effect for Ticket Cards
   -------------------------------------------------------------------------- */
function initTicketsTilt() {
  const cards = document.querySelectorAll('.ticket-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within element
      const y = e.clientY - rect.top;  // y position within element
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Get current scroll-linked tear progress to scale hover interactions
      const tearProgress = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tear-progress')) || 0;
      
      // Calculate tilt degrees (max 8deg rotation) scaled by tear progress
      const rotateX = ((centerY - y) / centerY) * 8 * tearProgress; 
      const rotateY = ((x - centerX) / centerX) * 8 * tearProgress;
      
      card.style.transform = `translateY(${-6 * tearProgress}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      // Smoothly reset tilt state on mouse leave
      card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    });
  });
}

/* --------------------------------------------------------------------------
   3. FAQ Accordion Expanding Logic
   -------------------------------------------------------------------------- */
function initFAQAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');

    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items for a clean single-open accordion feel
      accordionItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.accordion-content');
          if (otherContent) otherContent.style.maxHeight = '0';
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = '0';
      } else {
        item.classList.add('active');
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. Gallery Category Filtering
   -------------------------------------------------------------------------- */
function initGalleryFilter() {
  const tags = document.querySelectorAll('.tag-chip');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (tags.length === 0 || galleryItems.length === 0) return;

  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      // Toggle active states on chip tags
      tags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');

      const filterId = tag.id;
      let targetCategory = '';

      if (filterId === 'tag-brand') targetCategory = 'brand';
      else if (filterId === 'tag-design') targetCategory = 'design';
      else if (filterId === 'tag-motion') targetCategory = 'motion';
      else if (filterId === 'tag-photo') targetCategory = 'photo';

      galleryItems.forEach(item => {
        const itemCategories = item.getAttribute('data-category') || '';
        
        if (targetCategory === '' || itemCategories.includes(targetCategory)) {
          // Show matching item
          item.style.display = 'block';
          // Trigger CSS transitions
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          // Hide non-matching item
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          // Fully remove from flow after transition finishes
          setTimeout(() => {
            item.style.display = 'none';
          }, 400);
        }
      });
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
    threshold: 0.15 // Trigger when 15% of the element is visible
  };

  const observer = new IntersectionObserver((entries, self) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        self.unobserve(entry.target); // Stop observing once animated in
      }
    });
  }, observerOptions);

  revealElements.forEach((el, index) => {
    // Add staggered delay classes dynamically to siblings if desired
    const parent = el.parentElement;
    if (parent && parent.classList.contains('testimonials-grid')) {
      el.classList.add(`reveal-delay-${(index % 3) + 1}`);
    }
    
    observer.observe(el);
  });
}

/* --------------------------------------------------------------------------
   6. Native High-Performance Canvas Glass Refraction Distortion (WELCOME TO SALTEA)
   -------------------------------------------------------------------------- */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  // Offscreen canvas to hold the static, pristine text
  const textCanvas = document.createElement('canvas');
  const textCtx = textCanvas.getContext('2d');

  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;

  // Mouse coordinates tracked relative to canvas for all 3 spheres
  let mouseX = -1000;
  let mouseY = -1000;
  let mouseX2 = -1000;
  let mouseY2 = -1000;
  let mouseX3 = -1000;
  let mouseY3 = -1000;

  let targetMouseX = -1000;
  let targetMouseY = -1000;

  // Sizing configurations based on viewports
  let fontSizeTitle = 80;
  let fontSizeSub = 18;
  let lensRadius = 140;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;

    // If not initialized yet, place spheres offscreen for entrance glide
    if (mouseX2 === -1000) {
      mouseX2 = -150;
      mouseY2 = -150;
    }
    if (mouseX3 === -1000) {
      mouseX3 = width + 150;
      mouseY3 = height + 150;
    }

    // Scale canvas resolution with DPR for razor-sharp text on high-density screens
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    textCanvas.width = width * dpr;
    textCanvas.height = height * dpr;
    textCtx.scale(dpr, dpr);

    const isMobile = width < 768;
    const navbarHeight = isMobile ? 65 : 85;
    const ticketsOverlap = isMobile ? 0 : height * 0.05;
    const visibleHeight = height - navbarHeight - ticketsOverlap;

    // Calculate maximum allowed font size to fit vertical space with generous margins
    const textHeightFactor = isMobile ? 6.0 : 6.8;
    const maxFontSizeTitle = Math.max(28, visibleHeight / textHeightFactor);

    // Responsive fonts & lens parameters
    if (isMobile) {
      fontSizeTitle = Math.max(28, Math.min(width * 0.08, maxFontSizeTitle));
      lensRadius = Math.max(50, width * 0.15);
    } else {
      fontSizeTitle = Math.max(40, Math.min(110, width * 0.075, maxFontSizeTitle));
      lensRadius = Math.min(140, width * 0.095, height * 0.16);
      // Ensure lens radius scales in harmony with the text size
      lensRadius = Math.min(lensRadius, fontSizeTitle * 1.25);
    }

    renderStaticText();
  }

  function renderStaticText() {
    textCtx.clearRect(0, 0, width, height);

    const isMobile = width < 768;
    const navbarHeight = isMobile ? 65 : 85;
    const ticketsOverlap = isMobile ? 0 : height * 0.05;
    const visibleHeight = height - navbarHeight - ticketsOverlap;

    // Tight line spacing matching Framer reference
    const lineSpacing = fontSizeTitle * 0.98;
    
    // Vertical spacing gap between the two text sentences matching the reference
    const gap = isMobile ? fontSizeTitle * 1.0 : fontSizeTitle * 1.35;

    // Calculate total height of the 4 lines + gap to center the whole block vertically
    const totalTextHeight = (3 * lineSpacing) + gap + fontSizeTitle;
    
    // Set vertical start position centered within the visible height area (below navbar and above tickets)
    const startY = navbarHeight + (visibleHeight - totalTextHeight) / 2;
    const block2Y = startY + (2 * lineSpacing) + gap;

    // Font setting
    textCtx.textAlign = 'left'; // Left-aligned typography matching the design inspo
    textCtx.textBaseline = 'top';
    textCtx.font = `800 ${fontSizeTitle}px 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif`;

    // Measure widths to center the left-aligned block horizontally on desktop
    const w1 = textCtx.measureText('WELCOME TO').width;
    const w2 = textCtx.measureText('SALTEA STUDIO').width;
    const w3 = textCtx.measureText('WE CREATE VISUALS').width;
    const w4 = textCtx.measureText('THAT SPEAK').width;
    const maxTextWidth = Math.max(w1, w2, w3, w4);

    // Horizontal padding (8% on mobile, centered block on desktop)
    const paddingLeft = isMobile ? width * 0.08 : (width - maxTextWidth) / 2;

    // Set up drop shadow / volumetric glow properties (faint and crisp silver glow)
    textCtx.shadowColor = 'rgba(255, 255, 255, 0.12)';
    textCtx.shadowBlur = 8;
    textCtx.shadowOffsetX = 0;
    textCtx.shadowOffsetY = 0;

    // Draw Block 1: "WELCOME TO SALTEA STUDIO" with clean white-to-light-silver gradient
    const grad1 = textCtx.createLinearGradient(paddingLeft, startY, paddingLeft, startY + lineSpacing + fontSizeTitle);
    grad1.addColorStop(0, '#ffffff');    // Top pure white highlight
    grad1.addColorStop(1, '#b5b5ba');    // Matte silver bottom
    textCtx.fillStyle = grad1;
    textCtx.fillText('WELCOME TO', paddingLeft, startY);
    textCtx.fillText('SALTEA STUDIO', paddingLeft, startY + lineSpacing);

    // Draw Block 2: "WE CREATE VISUALS THAT SPEAK" with clean white-to-light-silver gradient
    const grad2 = textCtx.createLinearGradient(paddingLeft, block2Y, paddingLeft, block2Y + lineSpacing + fontSizeTitle);
    grad2.addColorStop(0, '#ffffff');    // Top pure white highlight
    grad2.addColorStop(1, '#b5b5ba');    // Matte silver bottom
    textCtx.fillStyle = grad2;
    textCtx.fillText('WE CREATE VISUALS', paddingLeft, block2Y);
    textCtx.fillText('THAT SPEAK', paddingLeft, block2Y + lineSpacing);

    // Reset shadows for safety
    textCtx.shadowColor = 'transparent';
    textCtx.shadowBlur = 0;
  }

  // Monitor mouse movement globally over the screen
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Track mouse if it is anywhere inside the viewport bounds
    if (x >= 0 && x <= width && y >= 0 && y <= height) {
      targetMouseX = x;
      targetMouseY = y;
    } else {
      // Fade out target coordinates when mouse exits window
      targetMouseX = -1000;
      targetMouseY = -1000;
    }
  });

  window.addEventListener('mouseleave', () => {
    targetMouseX = -1000;
    targetMouseY = -1000;
  });

  // Track touch movement for mobile devices
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        targetMouseX = x;
        targetMouseY = y;
      }
    }
  }, { passive: true });

  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        targetMouseX = x;
        targetMouseY = y;
      }
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    targetMouseX = -1000;
    targetMouseY = -1000;
  });

  // Smooth lerp and rendering loop
  function draw() {
    // 1. Lerp Sphere 1 (Big, follows cursor directly)
    if (targetMouseX === -1000) {
      if (mouseX !== -1000) {
        mouseX += (-1000 - mouseX) * 0.1;
        mouseY += (-1000 - mouseY) * 0.1;
        if (Math.abs(mouseX + 1000) < 1) {
          mouseX = -1000;
          mouseY = -1000;
        }
      }
    } else {
      if (mouseX === -1000) {
        mouseX = targetMouseX;
        mouseY = targetMouseY;
      } else {
        mouseX += (targetMouseX - mouseX) * 0.12;
        mouseY += (targetMouseY - mouseY) * 0.12;
      }
    }

    // 2. Autonomous drifting for Sphere 2 & 3 (always active, floating "here and there")
    const baseX2 = width * 0.28;
    const baseY2 = height * 0.35;
    const baseX3 = width * 0.72;
    const baseY3 = height * 0.65;

    const time = Date.now() * 0.00035; // Slower, softer drift speed (down from 0.0007)
    
    // Medium Sphere target position (even tighter elliptical drift)
    const targetX2 = baseX2 + Math.sin(time * 0.7) * 18;
    const targetY2 = baseY2 + Math.cos(time * 0.9) * 10;
    if (mouseX2 === -1000) {
      mouseX2 = targetX2;
      mouseY2 = targetY2;
    } else {
      mouseX2 += (targetX2 - mouseX2) * 0.035; // Damped follow speed
      mouseY2 += (targetY2 - mouseY2) * 0.035;
    }

    // Small Sphere target position (even tighter elliptical drift)
    const targetX3 = baseX3 + Math.cos(time * 0.5) * 22;
    const targetY3 = baseY3 + Math.sin(time * 0.8) * 12;
    if (mouseX3 === -1000) {
      mouseX3 = targetX3;
      mouseY3 = targetY3;
    } else {
      mouseX3 += (targetX3 - mouseX3) * 0.03; // Damped follow speed
      mouseY3 += (targetY3 - mouseY3) * 0.03;
    }

    ctx.clearRect(0, 0, width, height);

    // 3. Render the static background text (using physical bounds to fix DPR bug)
    ctx.drawImage(textCanvas, 0, 0, width * dpr, height * dpr, 0, 0, width, height);

    // 4. Perform spherical distortion lookup and draw the 3 spheres
    // Medium and Small spheres always render and drift autonomously
    if (mouseX2 !== -1000) {
      applyLensRefraction(mouseX2, mouseY2, lensRadius * 0.18); // Tiny medium sphere (down from 0.28)
    }
    if (mouseX3 !== -1000) {
      applyLensRefraction(mouseX3, mouseY3, lensRadius * 0.10); // Micro small sphere (down from 0.16)
    }
    // Big sphere only renders and refracts when cursor is on screen
    if (mouseX !== -1000) {
      applyLensRefraction(mouseX, mouseY, lensRadius);
    }

    requestAnimationFrame(draw);
  }

  function applyLensRefraction(mx, my, currentRadius) {
    const scaleX = mx * dpr;
    const scaleY = my * dpr;
    const scaleRadius = currentRadius * dpr;

    const canvasWidth = width * dpr;
    const canvasHeight = height * dpr;

    // Calculate bounding box of the lens
    const startX = Math.max(0, Math.floor(scaleX - scaleRadius));
    const endX = Math.min(canvasWidth, Math.ceil(scaleX + scaleRadius));
    const startY = Math.max(0, Math.floor(scaleY - scaleRadius));
    const endY = Math.min(canvasHeight, Math.ceil(scaleY + scaleRadius));

    const boxW = endX - startX;
    const boxH = endY - startY;

    if (boxW <= 0 || boxH <= 0) return;

    // Get source pixel data from text context and destination pixel data
    const srcImg = textCtx.getImageData(startX, startY, boxW, boxH);
    const srcData = srcImg.data;

    const destImg = ctx.getImageData(startX, startY, boxW, boxH);
    const destData = destImg.data;

    for (let y = 0; y < boxH; y++) {
      const actualY = startY + y;
      const dy = actualY - scaleY;

      for (let x = 0; x < boxW; x++) {
        const actualX = startX + x;
        const dx = actualX - scaleX;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < scaleRadius) {
          const normDist = dist / scaleRadius;

          // Advanced physical refraction based on hemisphere normal
          const nz = Math.sqrt(1.0 - normDist * normDist);
          
          // Legible physical refraction: positive-only factor to prevent flipping, keeping text readable
          const factor = 1.0 - 0.85 * nz;

          const refX = scaleX + dx * factor;
          const refY = scaleY + dy * factor;

          // Bilinear Interpolation Lookup to prevent pixelation/aliasing
          const rx = refX - startX;
          const ry = refY - startY;

          // Bounding coordinates
          const x0 = Math.floor(rx);
          const y0 = Math.floor(ry);
          const x1 = x0 + 1 < boxW ? x0 + 1 : x0;
          const y1 = y0 + 1 < boxH ? y0 + 1 : y0;

          const tx = rx - x0;
          const ty = ry - y0;

          // Indices in source pixel array
          const idx00 = (y0 * boxW + x0) * 4;
          const idx10 = (y0 * boxW + x1) * 4;
          const idx01 = (y1 * boxW + x0) * 4;
          const idx11 = (y1 * boxW + x1) * 4;

          // Interpolated values for R, G, B, A channels
          const r = srcData[idx00] * (1 - tx) * (1 - ty) + srcData[idx10] * tx * (1 - ty) + srcData[idx01] * (1 - tx) * ty + srcData[idx11] * tx * ty;
          const g = srcData[idx00 + 1] * (1 - tx) * (1 - ty) + srcData[idx10 + 1] * tx * (1 - ty) + srcData[idx01 + 1] * (1 - tx) * ty + srcData[idx11 + 1] * tx * ty;
          const b = srcData[idx00 + 2] * (1 - tx) * (1 - ty) + srcData[idx10 + 2] * tx * (1 - ty) + srcData[idx01 + 2] * (1 - tx) * ty + srcData[idx11 + 2] * tx * ty;
          const a = srcData[idx00 + 3] * (1 - tx) * (1 - ty) + srcData[idx10 + 3] * tx * (1 - ty) + srcData[idx01 + 3] * (1 - tx) * ty + srcData[idx11 + 3] * tx * ty;

          const destIdx = (y * boxW + x) * 4;
          destData[destIdx] = r;
          destData[destIdx + 1] = g;
          destData[destIdx + 2] = b;
          destData[destIdx + 3] = a;
        }
      }
    }

    // Write refracted pixel array back
    ctx.putImageData(destImg, startX, startY);

    // 3. Draw glass lens aesthetics matching the dark glossy 3D sphere in the reference

    // A. 3D volumetric glass shading (radial shadow gradient)
    const sphereBody = ctx.createRadialGradient(
      mx - currentRadius * 0.1, my - currentRadius * 0.1, currentRadius * 0.1,
      mx, my, currentRadius
    );
    sphereBody.addColorStop(0, 'rgba(4, 4, 6, 0.03)');        // Clearer center to see letters
    sphereBody.addColorStop(0.65, 'rgba(2, 2, 4, 0.65)');     // Dense mid-volume
    sphereBody.addColorStop(0.88, 'rgba(0, 0, 0, 0.88)');     // Near-opaque shadow boundary
    sphereBody.addColorStop(1, 'rgba(0, 0, 0, 0.98)');        // Deep ambient silhouette edge
    ctx.fillStyle = sphereBody;
    ctx.beginPath();
    ctx.arc(mx, my, currentRadius, 0, Math.PI * 2);
    ctx.fill();

    // A2. Holographic chromatic iridescence (purple/pink/blue metallic sheen matching Spline reference)
    const iridescence = ctx.createRadialGradient(
      mx - currentRadius * 0.15, my - currentRadius * 0.15, currentRadius * 0.2,
      mx, my, currentRadius
    );
    iridescence.addColorStop(0, 'rgba(180, 100, 255, 0.0)');      // Clearer center
    iridescence.addColorStop(0.35, 'rgba(180, 100, 255, 0.08)');  // Soft purple band
    iridescence.addColorStop(0.65, 'rgba(100, 200, 255, 0.15)');  // Soft cyan-blue band
    iridescence.addColorStop(0.88, 'rgba(255, 120, 200, 0.12)');  // Soft pink-magenta edge
    iridescence.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = iridescence;
    ctx.beginPath();
    ctx.arc(mx, my, currentRadius, 0, Math.PI * 2);
    ctx.fill();

    // B. Bright bottom rim crescent light reflection (highly reflective silver rim)
    const rimHighlight = ctx.createRadialGradient(
      mx, my + currentRadius * 0.35, currentRadius * 0.55,
      mx, my, currentRadius
    );
    rimHighlight.addColorStop(0.7, 'rgba(255, 255, 255, 0)');
    rimHighlight.addColorStop(0.9, 'rgba(255, 255, 255, 0.35)');
    rimHighlight.addColorStop(0.97, 'rgba(255, 255, 255, 0.68)'); // Brighter, sharper silver rim
    rimHighlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = rimHighlight;
    ctx.beginPath();
    ctx.arc(mx, my, currentRadius, 0, Math.PI * 2);
    ctx.fill();

    // C. Soft specular glare at top-left (more silvery and reflective)
    const softHighlight = ctx.createRadialGradient(
      mx - currentRadius * 0.25, my - currentRadius * 0.3, 0,
      mx - currentRadius * 0.25, my - currentRadius * 0.3, currentRadius * 0.55
    );
    softHighlight.addColorStop(0, 'rgba(255, 255, 255, 0.42)');
    softHighlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = softHighlight;
    ctx.beginPath();
    ctx.arc(mx, my, currentRadius, 0, Math.PI * 2);
    ctx.fill();

    // D. Sharp spotlight reflection dot at top-left
    const sharpHighlight = ctx.createRadialGradient(
      mx - currentRadius * 0.32, my - currentRadius * 0.35, 0,
      mx - currentRadius * 0.32, my - currentRadius * 0.35, currentRadius * 0.12
    );
    sharpHighlight.addColorStop(0, 'rgba(255, 255, 255, 0.82)');
    sharpHighlight.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
    sharpHighlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sharpHighlight;
    ctx.beginPath();
    ctx.arc(mx, my, currentRadius, 0, Math.PI * 2);
    ctx.fill();

    // E. Crisp outer edge sheen outline
    ctx.beginPath();
    ctx.arc(mx, my, currentRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'; // Silver outline sheen
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  window.addEventListener('resize', resize);
  resize();
  if (document.fonts) {
    document.fonts.ready.then(renderStaticText);
  }
  draw();

  // Trigger entry transitions for cinematic loading
  requestAnimationFrame(() => {
    canvas.style.opacity = '1';
    canvas.style.transform = 'scale(1) translate3d(0, 0, 0)';
  });
}

/* --------------------------------------------------------------------------
   8. Interactive Neural Constellation Graph Background Mesh (Marketing Section)
   -------------------------------------------------------------------------- */
function initMarketingCanvas() {
  const canvas = document.getElementById('marketing-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;

  let particles = [];
  const PARTICLE_COUNT = 45;
  const CONNECT_DISTANCE = 115;
  
  let mouseX = -1000;
  let mouseY = -1000;
  let mouseActive = false;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    
    initParticles();
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        r: 1.0 + Math.random() * 1.5
      });
    }
  }

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x >= 0 && x <= width && y >= 0 && y <= height) {
      mouseX = x;
      mouseY = y;
      mouseActive = true;
    } else {
      mouseActive = false;
    }
  });

  window.addEventListener('mouseleave', () => {
    mouseActive = false;
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECT_DISTANCE) {
          const alpha = (1 - dist / CONNECT_DISTANCE) * 0.14;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      if (mouseActive) {
        const dx = p1.x - mouseX;
        const dy = p1.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const alpha = (1 - dist / 150) * 0.22;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

/* --------------------------------------------------------------------------
   7. Native Inward Moving Particles for Contact Section Background
   -------------------------------------------------------------------------- */
function initContactCanvas() {
  const canvas = document.getElementById('contact-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;

  let particles = [];
  const PARTICLE_COUNT = 85;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    
    initParticles();
  }

  function createParticle(initial = false) {
    const angle = Math.random() * Math.PI * 2;
    const maxDist = Math.sqrt((width * width) / 4 + (height * height) / 4);
    const distance = initial ? Math.random() * maxDist : maxDist * (0.95 + Math.random() * 0.1);
    const speed = 0.35 + Math.random() * 0.65;
    const thickness = 0.7 + Math.random() * 0.9;

    return {
      angle,
      distance,
      speed,
      thickness,
      maxDist
    };
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle(true));
    }
  }

  function updateAndDraw() {
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.distance -= p.speed;

      if (p.distance < 15) {
        particles[i] = createParticle(false);
        continue;
      }

      const hx = cx + Math.cos(p.angle) * p.distance;
      const hy = cy + Math.sin(p.angle) * p.distance;

      const streakLength = 5 + p.speed * 8;
      const tx = cx + Math.cos(p.angle) * (p.distance + streakLength);
      const ty = cy + Math.sin(p.angle) * (p.distance + streakLength);

      let opacity = 1;
      if (p.distance < 120) {
        opacity = Math.max(0, (p.distance - 15) / 105);
      } else if (p.maxDist - p.distance < 50) {
        opacity = Math.max(0, (p.maxDist - p.distance) / 50);
      }

      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(tx, ty);
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.35})`;
      ctx.lineWidth = p.thickness;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    requestAnimationFrame(updateAndDraw);
  }

  window.addEventListener('resize', resize);
  resize();
  updateAndDraw();
}

/* --------------------------------------------------------------------------
   8. Spotlight Card Hover Glare
   -------------------------------------------------------------------------- */
function initSpotlightCards() {
  const cards = document.querySelectorAll('.testimonial-card, .accordion-item');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* --------------------------------------------------------------------------
   9. Magnetic Button/Link Attraction
   -------------------------------------------------------------------------- */
function initMagneticElements() {
  // Target CTA buttons, tag chips, nav links, and the logo link
  const elements = document.querySelectorAll('.cta-button, .tag-chip, .nav-link, .logo');

  elements.forEach(element => {
    let initialCenterX = 0;
    let initialCenterY = 0;

    element.addEventListener('mouseenter', () => {
      // Clear any active reset timeout
      if (element._magneticTimeout) {
        clearTimeout(element._magneticTimeout);
      }
      
      const rect = element.getBoundingClientRect();
      initialCenterX = rect.left + rect.width / 2 + window.scrollX;
      initialCenterY = rect.top + rect.height / 2 + window.scrollY;
      
      // Add slight lag to the tracking transition to make it feel gooey/organic
      element.style.transition = 'transform 0.12s cubic-bezier(0.25, 1, 0.5, 1)';
    });

    element.addEventListener('mousemove', (e) => {
      const mousePageX = e.clientX + window.scrollX;
      const mousePageY = e.clientY + window.scrollY;
      
      const deltaX = mousePageX - initialCenterX;
      const deltaY = mousePageY - initialCenterY;
      
      // Pull strength factor (0.28 matches best premium designs)
      const pullFactor = 0.28;
      const maxPull = 12; // Cap maximum displacement to prevent breaking layouts
      
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
      // Smooth springy deceleration back to origin
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
   10. Scroll-Linked Ticket Tear Animation
   -------------------------------------------------------------------------- */
function initTicketTear() {
  const wrapper = document.querySelector('.tickets-wrapper');
  
  if (!wrapper) return;

  const handleScroll = () => {
    const rect = wrapper.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Start tearing when the wrapper's top enters 75% of viewport height
    const triggerStart = viewportHeight * 0.75;
    // Completely tear before the wrapper's bottom leaves 25% of viewport height (scrolling up)
    const triggerEnd = viewportHeight * 0.25;
    
    const totalDist = triggerStart - (triggerEnd - rect.height);
    let progress = (triggerStart - rect.top) / totalDist;
    progress = Math.max(0, Math.min(1, progress));
    
    document.documentElement.style.setProperty('--tear-progress', progress);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll, { passive: true });
  
  // Set initial state
  handleScroll();
}

