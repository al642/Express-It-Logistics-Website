/**
 * Express It Logistics Ltd - Main JavaScript
 * Consolidated functionality for all pages
 * Safari-compatible with proper event handling
 */

(function () {
  "use strict";

  // ============================================
  // DARK MODE HANDLER
  // ============================================
  
// sourcery skip: avoid-function-declarations-in-blocks
  function initDarkMode() {
    const toggle = document.getElementById("theme-toggle");
    const mobileToggle = document.getElementById("theme-toggle-mobile");

    // Function to toggle dark mode
    function toggleDarkMode() {
      document.body.classList.toggle("dark-mode");
      // Also toggle .dark class for CSS compatibility
      document.body.classList.toggle("dark");

      const isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      
      // Update all theme toggle icons
      updateThemeIcons();
    }

    // Function to update all theme toggle icons
    function updateThemeIcons() {
      const isDark = document.body.classList.contains("dark-mode");
      document.querySelectorAll('#theme-toggle i, #theme-toggle-mobile i').forEach(icon => {
        if (icon) {
          icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
      });
    }

    // Theme toggle click handler (desktop)
    if (toggle) {
      toggle.addEventListener("click", toggleDarkMode);
    }

    // Theme toggle click handler (mobile)
    if (mobileToggle) {
      mobileToggle.addEventListener("click", toggleDarkMode);
    }

    // Load saved theme on page load
    function loadTheme() {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        document.body.classList.add("dark");
      } else if (!savedTheme) {
        // No saved preference - check system preference
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDarkScheme) {
          document.body.classList.add("dark-mode");
          document.body.classList.add("dark");
        }
      }
      updateThemeIcons();
    }

    // Run on DOMContentLoaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", loadTheme);
    } else {
      loadTheme();
    }

    // Listen for system preference changes in real-time
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
      // Only auto-switch if user hasn't set a manual preference
      if (!localStorage.getItem("theme")) {
        if (e.matches) {
          document.body.classList.add("dark-mode");
          document.body.classList.add("dark");
        } else {
          document.body.classList.remove("dark-mode");
          document.body.classList.remove("dark");
        }
        updateThemeIcons();
      }
    });
  }

  // ============================================
  // HEADER LINK NORMALIZATION
  // ============================================

  function normalizeHeaderLinks() {
    const currentPath = window.location.pathname.toLowerCase();
    const inPagesFolder = currentPath.includes('/pages/') || currentPath.includes('\\pages\\');

    const linkMap = {
      home: inPagesFolder ? '../index.html' : 'index.html',
      services: inPagesFolder ? 'services.html' : 'pages/services.html',
      team: inPagesFolder ? 'team.html' : 'pages/team.html',
      contact: inPagesFolder ? 'contact.html' : 'pages/contact.html'
    };

    const navAnchors = document.querySelectorAll('.main-nav a, #mobile-menu a');
    navAnchors.forEach((link) => {
      const text = link.textContent.trim().toLowerCase();
      if (!text) return;

      if (text.includes('track shipment')) {
        // Do not overwrite external track link
        return;
      }

      for (const key in linkMap) {
        if (text.includes(key)) {
          link.href = linkMap[key];
          break;
        }
      }
    });

    const setActiveNavigation = () => {
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      document.querySelectorAll('.main-nav .nav-link, #mobile-menu .mobile-nav-link').forEach((link) => {
        link.classList.remove('active');
        const hrefPage = link.getAttribute('href')?.split('/').pop();
        if (!hrefPage) return;
        if (hrefPage === currentPage || (currentPage === '' && hrefPage === 'index.html')) {
          link.classList.add('active');
        }
      });
    };

    setActiveNavigation();

    document.querySelectorAll('.main-nav .nav-link, #mobile-menu .mobile-nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        setTimeout(setActiveNavigation, 20);
        const menu = document.getElementById('mobile-menu');
        const btn = document.getElementById('mobile-menu-btn');
        if (menu) menu.classList.remove('open');
        if (btn) {
          btn.classList.remove('active');
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    const mobileTrackLink = document.getElementById('mobile-track-link');
    if (mobileTrackLink) {
      const isMobileView = window.matchMedia('(max-width: 768px)').matches;
      mobileTrackLink.href = isMobileView ? 'https://touch.track-trace.com/' : 'https://www.track-trace.com/';
    }
  }

  // Expose for header loader fallback steps and other integrations.
  window.normalizeHeaderLinks = normalizeHeaderLinks;

  function preloadHeroImages() {
    const slideImages = [
      'images/slide1.jpeg',
      'images/slide2.jpeg',
      'images/slide3.jpeg',
      'images/slide4.jpeg',
      'images/slide5.jpeg',
      'images/slide6.jpeg',
      'images/slide7.jpeg',
      'images/slide8.jpeg',
      'images/slide9.jpeg',
      'images/slide10.jpeg',
      'images/slide11.jpeg',
      'images/slide12.jpeg'
    ];

    slideImages.forEach((src, index) => {
      const img = new Image();
      img.onload = () => {
        console.log(`Slide ${index + 1} preloaded`);
      };
      img.onerror = () => {
        console.warn(`Failed to preload slide ${index + 1}`);
      };
      img.src = src;
    });
  }

  function getHeaderTemplatePath() {
    const currentPath = window.location.pathname.toLowerCase();
    return currentPath.includes('/pages/') || currentPath.includes('\\pages\\') ? '../header.html' : 'header.html';
  }

  function normalizeLogoPath() {
    const logo = document.querySelector('.brand .logo');
    if (!logo) return;
    const currentPath = window.location.pathname.toLowerCase();
    const inPagesFolder = currentPath.includes('/pages/') || currentPath.includes('\\pages\\');
    logo.src = inPagesFolder ? '../assets/images/logo.png' : './assets/images/logo.png';
    const brandLink = document.querySelector('.brand');
    if (brandLink) {
      brandLink.href = inPagesFolder ? '../index.html' : './index.html';
    }
  }

function initTeamCardExpansion() {
    const cards = document.querySelectorAll('.team-card');
    if (!cards.length) return;

    // Mobile/touch devices only for tap expansion
    const isMobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;

    if (!isMobile) return;

    cards.forEach((card) => {
      card.addEventListener('click', (event) => {
        // Prevent on links/buttons/images
        if (event.target.closest('a, button, img')) return;
        
        event.stopPropagation();
        event.preventDefault();
        
        // Exclusive expand: close all others
        cards.forEach((otherCard) => {
          if (otherCard !== card) {
            otherCard.classList.remove('expanded');
          }
        });
        
        // Toggle target
        card.classList.toggle('expanded');
      });
    });

    // Close on outside click (mobile)
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.team-card')) {
        cards.forEach((card) => card.classList.remove('expanded'));
      }
    });
  }

  function applyPageHeaderStyle() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const currentPath = window.location.pathname.toLowerCase();
    const isHomePage = currentPath === '/' || currentPath.endsWith('index.html') || currentPath.endsWith('index.htm');

    if (isHomePage) {
      header.classList.remove('page-header');
    } else {
      header.classList.add('page-header');
    }
  }

  async function loadHeaderTemplate() {
    const placeholder = document.getElementById('site-header-placeholder');
    if (!placeholder) return;

    const fallback = `
<header class="site-header">
  <div class="header-container">
    <a href="/index.html" class="brand">
      <img src="/assets/images/logo.png" alt="Express It Logistics Ltd Logo" class="logo">
      <div class="brand-text"><span class="brand-name">Express It Logistics Ltd</span></div>
    </a>
    <nav class="main-nav nav-links">
      <a href="index.html" class="nav-link">Home</a>
      <a href="pages/services.html" class="nav-link">Services</a>
      <a href="pages/team.html" class="nav-link">Team</a>
      <a href="pages/contact.html" class="nav-link">Contact</a>
      <a href="https://www.track-trace.com/" class="nav-btn btn-outline" target="_blank" rel="noopener noreferrer">Track Shipment</a>
      <button id="theme-toggle" class="dark-mode-toggle" aria-label="Toggle dark mode"><i class="fas fa-moon" aria-hidden="true"></i></button>
    </nav>
    <button id="mobile-menu-btn" class="mobile-menu-btn menu-toggle" aria-label="Open menu" aria-expanded="false"></button>
  </div>
  <nav id="mobile-menu" role="navigation" aria-label="Mobile navigation">
    <a href="index.html" class="mobile-nav-link">Home</a>
    <a href="pages/services.html" class="mobile-nav-link">Services</a>
    <a href="pages/team.html" class="mobile-nav-link">Team</a>
    <a href="pages/contact.html" class="mobile-nav-link">Contact</a>
    <a id="mobile-track-link" href="https://www.track-trace.com/" class="mobile-nav-link btn-outline" target="_blank" rel="noopener noreferrer">Track Shipment</a>
    <div class="mobile-theme-toggle"><button id="theme-toggle-mobile" class="dark-mode-toggle" aria-label="Toggle dark mode"><i class="fas fa-moon" aria-hidden="true"></i></button></div>
  </nav>
</header>
    `;

    try {
      const path = getHeaderTemplatePath();
      const response = await fetch(path, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Header fetch failed: ${response.status}`);
      const html = await response.text();
      placeholder.innerHTML = html;
      normalizeHeaderLinks();
      normalizeLogoPath();
      applyPageHeaderStyle();
    } catch (e) {
      console.warn('Header load failed; using fallback header.', e);
      placeholder.innerHTML = fallback;
      normalizeHeaderLinks();
      normalizeLogoPath();
      applyPageHeaderStyle();
    }
  }

  // ============================================
  // UTILITIES
  // ============================================

  // Sanitize user input to prevent script injection
  const sanitizeInput = (input) => {
    if (!input) return '';
    return String(input).replace(/[<>]/g, '').trim();
  };

  // Validate Email Format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Show Notification
  const showNotification = (message, type) => {
    // Remove existing notification
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement("div");
    notification.className = "notification fixed top-24 right-4 z-50 px-6 py-4 rounded-lg shadow-lg max-w-sm transition-all duration-300";
    notification.setAttribute("role", "alert");
    notification.setAttribute("aria-live", "polite");

    // Set notification style based on type
    if (type === "success") {
      notification.style.backgroundColor = "#059669";
      notification.style.color = "#ffffff";
    } else if (type === "error") {
      notification.style.backgroundColor = "#dc2626";
      notification.style.color = "#ffffff";
    } else {
      notification.style.backgroundColor = "var(--color-primary)";
      notification.style.color = "#ffffff";
    }

    notification.textContent = message;

    // Add close button
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "×";
    closeBtn.style.cssText = "background: none; border: none; color: inherit; font-size: 1.5rem; cursor: pointer; position: absolute; top: 0.25rem; right: 0.5rem; padding: 0; line-height: 1;";
    closeBtn.setAttribute("aria-label", "Dismiss notification");
    closeBtn.addEventListener("click", () => notification.remove());
    notification.appendChild(closeBtn);

    document.body.appendChild(notification);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.opacity = "0";
        notification.style.transform = "translateX(100%)";
        setTimeout(() => notification.remove?.(), 300);
      }
    }, 5000);
  };

  // ============================================
  // COPYRIGHT YEAR
  // ============================================

  const setCopyrightYear = () => {
    // Handle .copyright-year elements (existing)
    const copyrightYearElements = document.querySelectorAll(".copyright-year");
    copyrightYearElements.forEach((el) => {
      el.textContent = "2026";
    });

    // Handle #current-year elements (footer current year)
    const currentYearElements = document.querySelectorAll("#current-year");
    currentYearElements.forEach((el) => {
      el.textContent = new Date().getFullYear();
    });

    // Backward compatibility for old #year IDs
    const yearElement = document.getElementById("year");
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  };

  // ============================================
  // MOBILE MENU MANAGER
  // ============================================

  class MobileMenuManager {
    constructor() {
      this.menu = null;
      this.btn = null;
      this.isOpen = false;
      this.init();
    }

    init() {
      this.btn = document.getElementById("mobile-menu-btn");
      this.menu = document.getElementById("mobile-menu");

      if (!this.btn || !this.menu) {
      setTimeout(() => this.init(), 120);
      return;
    }

    // Toggle button
    this.btn.addEventListener("click", () => this.toggle());

    // Close on document click (delegated)
    document.addEventListener("click", (e) => this.handleOutsideClick(e));

      // Close on Escape key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isOpen) this.close();
      });

      // Close on link click
      this.menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => this.close());
      });
    }

    toggle() {
      this.isOpen = !this.isOpen;
      this.menu.classList.toggle("open", this.isOpen);
      this.btn.classList.toggle("active", this.isOpen);
      this.btn.setAttribute("aria-expanded", this.isOpen);
    }

    close() {
      this.isOpen = false;
      this.menu.classList.remove("open");
      this.btn?.classList.remove("active");
      this.btn?.setAttribute("aria-expanded", "false");
    }

    handleOutsideClick(e) {
      if (this.isOpen && !this.menu.contains(e.target) && !this.btn.contains(e.target)) {
        this.close();
      }
    }
  }

  // ============================================
// SMART HEADER SCROLL MANAGER (Hide on fast down-scroll, show on any up-scroll)
  // ============================================

  class SmartHeaderScroll {
    constructor() {
      this.header = document.querySelector('.site-header');
      if (!this.header) {
        // Retry after potential dynamic load
        setTimeout(() => this.init(), 200);
        return;
      }
      this.init();
    }

    init() {
      this.lastScrollY = window.scrollY;
      this.ticking = false;
      
      // Wheel + touch for mobile/desktop
      window.addEventListener('wheel', (e) => this.handleWheel(e), { passive: true });
      window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
      
      // Touch support for mobile scroll detection
      let touchStartY = 0;
      document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
      }, { passive: true });
      
      document.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;
        if (Math.abs(deltaY) > 8) { // Mobile sensitivity
          this.scrollDelta = deltaY > 0 ? 15 : -8; // Simulate scroll delta
          this.updateHeader();
          touchStartY = touchY;
        }
      }, { passive: true });
    }

    handleWheel(e) {
      // Capture wheel delta for finer control
      this.scrollDelta = e.deltaY;
      this.updateHeader();
    }

    handleScroll() {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          this.scrollDelta = scrollY - this.lastScrollY;
          this.updateHeader();
          this.lastScrollY = scrollY;
          this.ticking = false;
        });
        this.ticking = true;
      }
    }

    updateHeader() {
      if (!this.header || window.scrollY < 100) {
        this.header?.classList.remove('hidden');
        return;
      }

      const isMobile = window.innerWidth <= 768;
      const hideThreshold = isMobile ? 15 : 20;
      const showThreshold = isMobile ? 8 : 10;

      if (this.scrollDelta > hideThreshold) {
        // Fast down-scroll: hide
        this.header.classList.add('scrolled', 'hidden');
      } else if (this.scrollDelta < -showThreshold) {
        // Any up-scroll: show immediately
        this.header.classList.remove('hidden');
        this.header.classList.add('scrolled');
      }
    }
  }

  // ============================================
  // SMOOTH SCROLL MANAGER
  // ============================================

  class SmoothScrollManager {
    constructor() {
      this.init();
    }

    init() {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
          const href = anchor.getAttribute("href");
          if (href === "#") return;

          e.preventDefault();
          const target = document.querySelector(href);
          if (!target) return;

          const headerOffset = 100;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({ top: offsetPosition, behavior: "smooth" });

          // Close mobile menu
          const mobileMenu = document.getElementById("mobile-menu");
          mobileMenu?.classList.remove("open");
        });
      });
    }
  }

  // ============================================
  // MOBILE TRACK LINK MANAGER
  // ============================================

  class MobileTrackLinkManager {
    constructor() {
      this.desktopURL = 'https://www.track-trace.com/';
      this.mobileURL = 'https://touch.track-trace.com';
      this.breakdown = '(max-width: 768px)';
      this.init();
    }

    init() {
      const updateLink = () => {
        const link = document.getElementById('mobile-track-link');
        if (!link) return;
        const isMobile = window.matchMedia?.(this.breakdown)?.matches ?? false;
        link.href = isMobile ? this.mobileURL : this.desktopURL;
      };

      updateLink();
      window.addEventListener('resize', updateLink, { passive: true });
      window.addEventListener('orientationchange', () => setTimeout(updateLink, 100));
    }
  }

  // ============================================
  // PARTNERS CAROUSEL MANAGER (Swipe Support)
  // ============================================

  class PartnersCarouselManager {
    constructor() {
      this.container = document.querySelector('.partners-carousel-container');
      this.carousel = document.querySelector('.partners-carousel');
      
      this.touchStartX = 0;
      this.touchStartY = 0;
      this.touchEndX = 0;
      this.touchEndY = 0;
      this.isMouseDown = false;
      this.mouseStartX = 0;
      this.scrollStart = 0;
      
      this.minSwipeDistance = 50;
      
      if (this.container && this.carousel) {
        this.init();
      }
    }

    init() {
      // Touch events for mobile swipe
      this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
      this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
      this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
      
      // Mouse events for desktop drag
      this.container.addEventListener('mousedown', (e) => this.handleMouseDown(e));
      document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      document.addEventListener('mouseup', () => this.handleMouseUp());
      
      // Pause animation on hover/touch to allow manual scrolling
      this.container.addEventListener('mouseenter', () => this.pauseAnimation());
      this.container.addEventListener('mouseleave', () => this.resumeAnimation());
      this.container.addEventListener('touchstart', () => this.pauseAnimation(), { passive: true });
      this.container.addEventListener('touchend', () => this.resumeAnimation(), { passive: true });
    }

    handleTouchStart(e) {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    }

    handleTouchMove(e) {
      // Allow vertical scrolling but prevent horizontal overscroll
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const diffX = Math.abs(touchX - this.touchStartX);
      const diffY = Math.abs(touchY - this.touchStartY);
      
      // If horizontal swipe is dominant, prevent vertical scroll
      if (diffX > diffY && diffX > 10) {
        e.preventDefault();
      }
    }

    handleTouchEnd(e) {
      this.touchEndX = e.changedTouches[0].clientX;
      this.touchEndY = e.changedTouches[0].clientY;
      
      const swipeDistance = this.touchStartX - this.touchEndX;
      
      if (Math.abs(swipeDistance) > this.minSwipeDistance) {
        // Determine swipe direction
        if (swipeDistance > 0) {
          // Swipe left - scroll right
          this.scrollByAmount(200);
        } else {
          // Swipe right - scroll left
          this.scrollByAmount(-200);
        }
      }
    }

    handleMouseDown(e) {
      if (e.target.closest('.partner-item')) return;
      this.isMouseDown = true;
      this.mouseStartX = e.clientX;
      this.scrollStart = this.carousel.scrollLeft;
      this.carousel.style.cursor = 'grabbing';
      this.pauseAnimation();
    }

    handleMouseMove(e) {
      if (!this.isMouseDown) return;
      e.preventDefault();
      const diff = this.mouseStartX - e.clientX;
      this.carousel.scrollLeft = this.scrollStart + diff;
    }

    handleMouseUp() {
      if (this.isMouseDown) {
        this.isMouseDown = false;
        this.carousel.style.cursor = 'grab';
        this.resumeAnimation();
      }
    }

    scrollByAmount(amount) {
      const currentScroll = this.carousel.scrollLeft;
      this.carousel.scrollTo({
        left: currentScroll + amount,
        behavior: 'smooth'
      });
    }

    pauseAnimation() {
      this.carousel.style.animationPlayState = 'paused';
    }

    resumeAnimation() {
      this.carousel.style.animationPlayState = 'running';
    }
  }



  // ============================================
  // HERO SLIDER MANAGER
  // ============================================

  class HeroSliderManager {
    constructor() {
      this.slider = document.querySelector('.hero-section');
      this.slides = document.querySelectorAll('.hero-slider .hero-slide');

      this.current = 0;
      this.slideInterval = null;
      this.slideDuration = 4500; // A little smoother pacing

      if (this.slider && this.slides.length > 0) {
        this.init();
      }
    }

    init() {
      // Show first slide immediately, then begin loop
      this.showSlide(0);
      this.bindEvents();
      this.startSlider();
    }

    bindEvents() {
      // Slider runs continuously without interruption from mouse hover
      this.initTouchSupport();
    }

    initTouchSupport() {
      if (!this.slider) return;

      let startX = 0;

      this.slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
      }, { passive: true });

      this.slider.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;

        if (diff > 50) {
          this.nextSlide();
        } else if (diff < -50) {
          this.prevSlide();
        }
      }, { passive: true });
    }

    showSlide(index) {
      if (index === this.current) return;

      // Update visual state
      const previous = this.slides[this.current];
      const nextSlide = this.slides[index];

      if (previous) previous.classList.remove('active');
      if (nextSlide) nextSlide.classList.add('active');

      this.current = index;
    }

    nextSlide() {
      const nextIndex = (this.current + 1) % this.slides.length;
      this.goToSlide(nextIndex);
    }

    prevSlide() {
      const prevIndex = (this.current - 1 + this.slides.length) % this.slides.length;
      this.goToSlide(prevIndex);
    }

    goToSlide(index) {
      if (index === this.current) return;
      this.showSlide(index);
    }

    startSlider() {
      if (this.slideInterval) {
        clearInterval(this.slideInterval);
      }
      this.slideInterval = setInterval(() => this.nextSlide(), this.slideDuration);
    }

    pauseSlider() {
      if (this.slideInterval) {
        clearInterval(this.slideInterval);
        this.slideInterval = null;
      }
    }

    resumeSlider() {
      if (!this.slideInterval) {
        this.startSlider();
      }
    }
  }

  // ============================================
  // FORM SUBMISSION MANAGER
  // ============================================

  class FormSubmissionManager {
    constructor() {
      this.form = document.getElementById('contact-form');
      if (this.form) this.init();
    }

    init() {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
      e.preventDefault();

      const formData = new FormData(this.form);
      const name = sanitizeInput(formData.get('name'));
      const email = sanitizeInput(formData.get('email'));
      const phone = sanitizeInput(formData.get('phone'));
      const service = sanitizeInput(formData.get('service'));
      const message = sanitizeInput(formData.get('message'));

      // Validation
      const errors = [];
      if (!name) errors.push('Please enter your name');
      if (!email || !isValidEmail(email)) errors.push('Please enter a valid email');
      if (!message) errors.push('Please enter your message');

      if (errors.length > 0) {
        showNotification(errors.join('. '), 'error');
        return;
      }

      // Submit
      const submitBtn = this.form.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2" aria-hidden="true"></i> Sending...';
      submitBtn.disabled = true;

      try {
        const cleanFormData = new FormData();
        cleanFormData.set('name', name);
        cleanFormData.set('email', email);
        cleanFormData.set('phone', phone);
        cleanFormData.set('service', service);
        cleanFormData.set('message', message);

        const response = await fetch(this.form.action, {
          method: 'POST',
          body: cleanFormData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          showNotification('Thank you for your inquiry! Our team will contact you at ' + email + ' within 24 hours.', 'success');
          this.form.reset();
        } else {
          showNotification('There was a problem sending your message. Please try again or email us directly.', 'error');
        }
      } catch {
        showNotification('There was a problem sending your message. Please try again or email us directly.', 'error');
      } finally {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
      }
    }
  }

  // ============================================
  // SERVICE WORKER MANAGER
  // ============================================

  class ServiceWorkerManager {
    constructor() {
      this.init();
    }

    init() {
      if (!('serviceWorker' in navigator)) return;
      if (!(window.location.protocol === 'https:' || window.location.hostname === 'localhost')) return;

      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(registration => {
            registration.addEventListener('updatefound', () => {
              const worker = registration.installing;
              worker?.addEventListener('statechange', () => {
                if (worker.state === 'installed' && navigator.serviceWorker.controller) {
                  showNotification('New version available! Refresh to update.', 'info');
                }
              });
            });
          })
          .catch(() => { /* Silent fail */ });

        // Check for updates every 5 minutes
        setInterval(() => {
          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.getRegistration().then(r => r?.update());
          }
        }, 300000);
      });
    }
  }

  // ============================================
  // INITIALIZATION
  // ====================================

const initNoHeader = () => {
    // Header already embedded statically - no dynamic load needed

    // Activate dark mode
    initDarkMode();

    setCopyrightYear();
    new MobileMenuManager();
    normalizeHeaderLinks();
    preloadHeroImages();
    new NavbarScrollManager();
    new SmoothScrollManager();
    new MobileTrackLinkManager();
    new PartnersCarouselManager();
    new FormSubmissionManager();
    new ServiceWorkerManager();
    new HeroSliderManager();
    initTeamCardExpansion();
  };

// Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNoHeader);
  } else {
    initNoHeader();
  }

  // Export for external use
  window.ExpressIT = {
    theme: {
      toggle: () => {
        document.body.classList.toggle("dark-mode");
        document.body.classList.toggle("dark");
        const isDark = document.body.classList.contains("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");
      },
      isDark: () => document.body.classList.contains("dark-mode")
    },
    showNotification,
    isValidEmail,
    sanitizeInput
  };

})();

