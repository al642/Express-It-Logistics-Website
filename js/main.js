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
  
  function initDarkMode() {
    const toggle = document.getElementById("theme-toggle");
    const mobileToggle = document.getElementById("theme-toggle-mobile");

    // Function to toggle dark mode
    function toggleDarkMode() {
      const html = document.documentElement;
      const isDark = html.classList.contains("dark-mode");

      if (isDark) {
        html.classList.remove("dark-mode", "dark");
        document.body.classList.remove("dark-mode", "dark");
      } else {
        html.classList.add("dark-mode", "dark");
        document.body.classList.add("dark-mode", "dark");
      }

      localStorage.setItem("theme", isDark ? "light" : "dark");

      // Update all theme toggle icons
      updateThemeIcons();
    }

    // Function to update all theme toggle icons
    function updateThemeIcons() {
      const isDark = document.body.classList.contains("dark-mode");
      document.querySelectorAll('#theme-toggle i, #theme-toggle-mobile i').forEach((icon) => {
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
      const html = document.documentElement;
      const savedTheme = localStorage.getItem("theme");

      if (savedTheme === "dark") {
        html.classList.add("dark-mode", "dark");
        document.body.classList.add("dark-mode", "dark");
      } else if (!savedTheme) {
        // No saved preference - check system preference
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDarkScheme) {
          html.classList.add("dark-mode", "dark");
          document.body.classList.add("dark-mode", "dark");
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
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      // Only auto-switch if user hasn't set a manual preference
      if (!localStorage.getItem("theme")) {
        const html = document.documentElement;
        if (e.matches) {
          html.classList.add("dark-mode", "dark");
          document.body.classList.add("dark-mode", "dark");
        } else {
          html.classList.remove("dark-mode", "dark");
          document.body.classList.remove("dark-mode", "dark");
        }
        updateThemeIcons();
      }
    });
  }

  // ============================================
  // HEADER LINK NORMALIZATION
  // ============================================

  function getNormalizedPath(pathname = window.location.pathname) {
    return pathname.toLowerCase().replace(/\/+$/, '') || '/';
  }

  function getPageKey(pathname = window.location.pathname) {
    const normalizedPath = getNormalizedPath(pathname);
    const segments = normalizedPath.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1] || '';
    const cleanSegment = lastSegment.replace(/\.(html?|php)$/i, '');

    if (normalizedPath === '/' || cleanSegment === 'index' || cleanSegment === 'home') {
      return 'home';
    }

    if (segments[0] === 'pages' && cleanSegment) {
      return cleanSegment;
    }

    return cleanSegment || 'home';
  }

  function getAssetPrefix(pathname = window.location.pathname) {
    const normalizedPath = getNormalizedPath(pathname);
    const segments = normalizedPath.split('/').filter(Boolean);
    const pageKey = getPageKey(pathname);

    if (normalizedPath === '/' || pageKey === 'home') {
      return '';
    }

    return segments.length > 0 ? '../' : '';
  }

  function normalizeHeaderLinks() {
    const linkMap = {
      home: getAssetPrefix() ? '../' : '/',
      services: getAssetPrefix() ? '../services/' : 'services/',
      team: getAssetPrefix() ? '../team/' : 'team/',
      contact: getAssetPrefix() ? '../contact/' : 'contact/'
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
      const currentPageKey = getPageKey();

      document.querySelectorAll('.main-nav .nav-link, #mobile-menu .mobile-nav-link').forEach((link) => {
        link.classList.remove('active');

        let hrefPageKey = '';
        try {
          hrefPageKey = getPageKey(new URL(link.getAttribute('href'), window.location.origin).pathname);
        } catch {
          hrefPageKey = '';
        }

        if (hrefPageKey && hrefPageKey === currentPageKey) {
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
    const assetPrefix = getAssetPrefix();
    const slideImages = [
      `${assetPrefix}images/slide1.jpeg`,
      `${assetPrefix}images/slide2.jpeg`,
      `${assetPrefix}images/slide3.jpeg`,
      `${assetPrefix}images/slide4.jpeg`,
      `${assetPrefix}images/slide5.jpeg`,
      `${assetPrefix}images/slide6.jpeg`,
      `${assetPrefix}images/slide7.jpeg`,
      `${assetPrefix}images/slide8.jpeg`,
      `${assetPrefix}images/slide9.jpeg`,
      `${assetPrefix}images/slide10.jpeg`,
      `${assetPrefix}images/slide11.jpeg`,
      `${assetPrefix}images/slide12.jpeg`
    ];

    slideImages.forEach((src) => {
      const img = new Image();
      img.onload = () => {};
      img.onerror = () => {};
      img.src = src;
    });
  }

  function initTeamCardExpansion() {
    const cardSlots = Array.from(document.querySelectorAll('.team-card-slot'));
    const cards = Array.from(document.querySelectorAll('.team-card'));
    if (!cards.length) return;

    const desktopHoverQuery = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 769px)');
    const mobileQuery = window.matchMedia('(max-width: 768px), (pointer: coarse)');
    let layoutFrame = 0;
    const collapsedCardHeight = 360;
    let mobileHandlersBound = false;

    const syncExpandedCardHeights = () => {
      cards.forEach((card) => {
        const description = card.querySelector('.team-card-desc');
        if (!description) return;

        const descriptionHeight = Math.ceil(description.scrollHeight);
        const expandedDescriptionHeight = Math.max(descriptionHeight + 32, 220);
        const expandedCardHeight = Math.max(collapsedCardHeight + expandedDescriptionHeight + 20, 580);

        card.style.setProperty('--team-card-desc-height', `${expandedDescriptionHeight}px`);
        card.style.setProperty('--team-card-expanded-height', `${expandedCardHeight}px`);
      });
    };

    const syncLastRowCards = () => {
      window.cancelAnimationFrame(layoutFrame);
      layoutFrame = window.requestAnimationFrame(() => {
        syncExpandedCardHeights();

        cards.forEach((card) => {
          card.classList.remove('team-card-last-row');
        });

        if (!desktopHoverQuery.matches) return;

        const slots = cardSlots.length
          ? cardSlots
          : cards.map((card) => card.parentElement).filter(Boolean);
        let lastRowTop = -Infinity;

        slots.forEach((slot) => {
          lastRowTop = Math.max(lastRowTop, Math.round(slot.getBoundingClientRect().top));
        });

        slots.forEach((slot) => {
          const slotTop = Math.round(slot.getBoundingClientRect().top);
          if (Math.abs(slotTop - lastRowTop) <= 6) {
            slot.querySelector('.team-card')?.classList.add('team-card-last-row');
          }
        });
      });
    };

    const bindMobileExpansion = () => {
      if (mobileHandlersBound) return;
      mobileHandlersBound = true;

      cards.forEach((card) => {
        card.addEventListener('click', (event) => {
          if (!mobileQuery.matches) return;

          // Prevent on links/buttons/images
          if (event.target.closest('a, button, img')) return;

          event.stopPropagation();
          event.preventDefault();

          cards.forEach((otherCard) => {
            if (otherCard !== card) {
              otherCard.classList.remove('expanded');
            }
          });

          card.classList.toggle('expanded');
        });
      });

      document.addEventListener('click', (event) => {
        if (!mobileQuery.matches) return;
        if (!event.target.closest('.team-card')) {
          cards.forEach((card) => card.classList.remove('expanded'));
        }
      });
    };

    const bindMediaChange = (mediaQuery, handler) => {
      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handler);
      } else if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(handler);
      }
    };

    syncLastRowCards();
    window.addEventListener('resize', syncLastRowCards, { passive: true });
    window.addEventListener('load', syncLastRowCards, { once: true });
    bindMediaChange(desktopHoverQuery, syncLastRowCards);
    bindMediaChange(mobileQuery, syncLastRowCards);

    if (document.fonts?.ready) {
      document.fonts.ready.then(syncLastRowCards).catch(() => {});
    }

    bindMobileExpansion();
  }

  function applyPageHeaderStyle() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const isHomePage = getPageKey() === 'home';

    if (isHomePage) {
      header.classList.remove('page-header');
      document.body.classList.add('home-page');
      document.body.classList.remove('inner-page');
    } else {
      header.classList.add('page-header');
      document.body.classList.add('inner-page');
      document.body.classList.remove('home-page');
    }

    const syncHeaderOffset = () => {
      const headerHeight = Math.ceil(header.getBoundingClientRect().height || 0);
      if (!headerHeight) return;

      if (isHomePage) {
        document.documentElement.style.setProperty('--header-offset', '0px');
      } else {
        document.documentElement.style.setProperty('--header-offset', `${headerHeight + 12}px`);
      }
    };

    syncHeaderOffset();
    window.addEventListener('resize', syncHeaderOffset, { passive: true });
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

      // Dismiss the mobile menu as soon as the user starts scrolling the page.
      window.addEventListener("scroll", () => {
        if (this.isOpen) this.close();
      }, { passive: true });

      // Close on touch-driven page interaction outside the menu for better mobile comfort.
      document.addEventListener("touchmove", (e) => {
        if (!this.isOpen) return;
        if (this.menu.contains(e.target) || this.btn.contains(e.target)) return;
        this.close();
      }, { passive: true });

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
      document.body.classList.toggle("mobile-menu-open", this.isOpen);
    }

    close() {
      this.isOpen = false;
      this.menu.classList.remove("open");
      this.btn?.classList.remove("active");
      this.btn?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("mobile-menu-open");
    }

    handleOutsideClick(e) {
      if (this.isOpen && !this.menu.contains(e.target) && !this.btn.contains(e.target)) {
        this.close();
      }
    }
  }

  // ============================================
  // NAVBAR SCROLL MANAGER
  // ============================================

  class NavbarScrollManager {
    constructor() {
      this.navbar = document.querySelector(".site-header");
      this.lastScrollY = window.scrollY || 0;
      this.scrollDirection = "up";
      this.ticking = false;
      this.hideThreshold = 12;
      this.showThreshold = 2;
      this.nearTopThreshold = 24;
      this.hideStart = 90;
      if (!this.navbar) {
        setTimeout(() => { this.navbar = document.querySelector(".site-header"); if (this.navbar) this.init(); }, 120);
      } else {
        this.init();
      }
    }

    init() {
      this.update();
      window.addEventListener("scroll", () => this.handleScroll(), { passive: true });
      window.addEventListener("resize", () => this.update(), { passive: true });
    }

    update() {
      const navbar = this.navbar;
      if (!navbar) return;

      const currentScrollY = Math.max(window.scrollY || 0, 0);
      const delta = currentScrollY - this.lastScrollY;
      const isMenuOpen = document.body.classList.contains("mobile-menu-open");
      const isNearTop = currentScrollY <= this.nearTopThreshold;
      const isScrollingDown = delta > this.hideThreshold;
      const isScrollingUp = delta < -this.showThreshold;

      if (isScrollingDown) this.scrollDirection = "down";
      if (isScrollingUp) this.scrollDirection = "up";

      navbar.classList.toggle("scrolled", currentScrollY > 18);
      navbar.classList.toggle("compact", currentScrollY > 28);

      if (isMenuOpen || isNearTop) {
        navbar.classList.remove("hidden");
        navbar.classList.remove("reveal");
      } else if (isScrollingDown && currentScrollY > this.hideStart) {
        navbar.classList.add("hidden");
        navbar.classList.remove("reveal");
      } else if (this.scrollDirection === "up") {
        navbar.classList.remove("hidden");
        navbar.classList.add("reveal");
      }

      if (currentScrollY <= 80) {
        navbar.classList.remove("reveal");
      }

      this.lastScrollY = currentScrollY;
    }

    handleScroll() {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.update();
          this.ticking = false;
        });
        this.ticking = true;
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
      this.slideDuration = 5600;
      this.isTransitioning = false;

      if (this.slider && this.slides.length > 0) {
        this.init();
      }
    }

    init() {
      this.slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === 0);
      });
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
      let startTime = 0;
      let velocity = 0;

      this.slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startTime = Date.now();
        velocity = 0;
      }, { passive: true });

      this.slider.addEventListener('touchmove', (e) => {
        // Prevent vertical scroll interference for strong horizontal swipes
        const currentX = e.touches[0].clientX;
        const diffX = Math.abs(currentX - startX);
        const diffY = Math.abs(e.touches[0].clientY - (e.touches[0].clientY || 0));
        if (diffX > diffY && diffX > 30) {
          e.preventDefault();
        }
      }, { passive: false });

      this.slider.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const timeDelta = Date.now() - startTime;
        const distance = startX - endX;
        velocity = Math.abs(distance) / timeDelta * 1000; // px/ms

        const threshold = 80;
        const fastSwipeThreshold = 0.4;

        if (distance > threshold || (distance > 40 && velocity > fastSwipeThreshold)) {
          this.nextSlide();
        } else if (distance < -threshold || (distance < -40 && velocity > fastSwipeThreshold)) {
          this.prevSlide();
        }
      }, { passive: true });
    }

    showSlide(index) {
      if (index === this.current || this.isTransitioning) return;

      const previous = this.slides[this.current];
      const nextSlide = this.slides[index];

      this.isTransitioning = true;

      if (nextSlide) {
        nextSlide.classList.remove('is-exiting');
        requestAnimationFrame(() => {
          nextSlide.classList.add('active');
        });
      }

      if (previous) {
        previous.classList.add('is-exiting');
        window.setTimeout(() => {
          previous.classList.remove('active', 'is-exiting');
        }, 1400);
      }

      this.current = index;

      window.setTimeout(() => {
        this.isTransitioning = false;
      }, 1400);
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
      this.startSlider();
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

  class ScrollRevealManager {
    constructor() {
      this.elements = [];
      this.observer = null;
      this.reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      this.reducedMotion = this.reducedMotionQuery.matches;
      this.heroSection = document.querySelector(".hero-section");
      this.heroSlider = document.querySelector(".hero-slider");
      this.parallaxTicking = false;
      this.boundParallaxUpdate = () => this.requestParallaxUpdate();
      this.boundMotionPreferenceChange = (event) => this.handleMotionPreferenceChange(event);

      if (!document.querySelector("main")) return;
      this.init();
    }

    init() {
      this.prepareRevealTargets();

      if (this.reducedMotion) {
        this.showAll();
      } else {
        this.createObserver();
        this.observeTargets();
        this.initHeroParallax();
      }

      this.reducedMotionQuery.addEventListener?.("change", this.boundMotionPreferenceChange);
    }

    prepareRevealTargets() {
      const singles = [
        [".hero-badge", "reveal-soft", 40],
        [".hero-title", "reveal-lift", 120],
        [".hero-subtitle", "reveal-soft", 220],
        [".hero-buttons", "reveal-soft", 300],
        [".scroll-indicator", "reveal-soft", 420],
        ["main .section-label", "reveal-soft", 0],
        ["main .section-title", "reveal-lift", 60],
        ["main .section-subtitle", "reveal-soft", 120],
        ["main .about-left > p", "reveal-soft", 120],
        ["main .about-card", "reveal-scale", 120],
        ["main .about-full > p", "reveal-soft", 80],
        ["main .about-highlights", "reveal-soft", 140],
        ["main .services-link-container", "reveal-soft", 160],
        ["main .contact-layout > div > h2", "reveal-soft", 80],
        ["main .contact-layout > div > p", "reveal-soft", 140],
        ["main .contact-layout form", "reveal-scale", 180],
        ["main .btn", "reveal-soft", 120],
        ["main .services-link", "reveal-soft", 120]
      ];

      singles.forEach(([selector, variant, delay]) => {
        document.querySelectorAll(selector).forEach((element) => {
          this.markReveal(element, { variant, delay });
        });
      });

      document.querySelectorAll('[data-reveal-group="stagger"]').forEach((group) => {
        const children = Array.from(group.children).filter((child) => {
          return child instanceof HTMLElement && !child.matches("script, style");
        });

        children.forEach((child, index) => {
          this.markReveal(child, {
            variant: child.matches(".stat-item, .card-secondary, .btn, .services-link") ? "reveal-soft" : "reveal-lift",
            delay: Math.min(index * 90, 420)
          });
        });
      });
    }

    markReveal(element, { variant = "reveal-lift", delay = 0 } = {}) {
      if (!element || !(element instanceof HTMLElement)) return;
      if (element.dataset.revealBound === "true") return;
      if (element.closest(".site-header, .footer, #mobile-menu, .partners-carousel")) return;

      element.dataset.revealBound = "true";
      element.classList.add("reveal-on-scroll", variant);
      element.style.setProperty("--reveal-delay", `${delay}ms`);
      this.elements.push(element);
    }

    createObserver() {
      if (this.observer) this.observer.disconnect();

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          this.observer?.unobserve(entry.target);
        });
      }, {
        threshold: 0.14,
        rootMargin: "0px 0px -12% 0px"
      });
    }

    observeTargets() {
      this.elements.forEach((element) => this.observer?.observe(element));
    }

    showAll() {
      this.elements.forEach((element) => element.classList.add("is-visible"));
      if (this.heroSlider) {
        this.heroSlider.style.transform = "";
      }
    }

    handleMotionPreferenceChange(event) {
      this.reducedMotion = event.matches;

      if (this.reducedMotion) {
        this.destroyParallax();
        this.observer?.disconnect();
        this.showAll();
        return;
      }

      this.createObserver();
      this.observeTargets();
      this.initHeroParallax();
    }

    initHeroParallax() {
      if (!this.heroSection || !this.heroSlider || this.reducedMotion) return;

      window.addEventListener("scroll", this.boundParallaxUpdate, { passive: true });
      window.addEventListener("resize", this.boundParallaxUpdate, { passive: true });
      this.requestParallaxUpdate();
    }

    requestParallaxUpdate() {
      if (this.parallaxTicking || this.reducedMotion) return;

      window.requestAnimationFrame(() => {
        this.updateHeroParallax();
        this.parallaxTicking = false;
      });

      this.parallaxTicking = true;
    }

    updateHeroParallax() {
      if (!this.heroSection || !this.heroSlider) return;

      const rect = this.heroSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 0;

      if (rect.bottom <= 0 || rect.top >= viewportHeight) return;

      const progress = Math.min(Math.max((0 - rect.top) / Math.max(rect.height, 1), 0), 1);
      const offset = progress * (window.matchMedia("(max-width: 768px)").matches ? 18 : 34);
      this.heroSlider.style.transform = `translate3d(0, ${offset}px, 0)`;
    }

    destroyParallax() {
      window.removeEventListener("scroll", this.boundParallaxUpdate);
      window.removeEventListener("resize", this.boundParallaxUpdate);

      if (this.heroSlider) {
        this.heroSlider.style.transform = "";
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
      const serviceWorkerPath = getAssetPrefix() ? '../sw.js' : './sw.js';

      window.addEventListener('load', () => {
        navigator.serviceWorker.register(serviceWorkerPath)
          .then(registration => {
            registration.update();

            if (registration.waiting) {
              registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }

            registration.addEventListener('updatefound', () => {
              const worker = registration.installing;
              worker?.addEventListener('statechange', () => {
                if (worker.state === 'installed' && navigator.serviceWorker.controller) {
                  worker.postMessage({ type: 'SKIP_WAITING' });
                  showNotification('New version available! Refresh to update.', 'info');
                }
              });
            });
          })
          .catch(() => { /* Silent fail */ });

        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        }, { once: true });

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

  const initPage = () => {
    normalizeHeaderLinks();
    applyPageHeaderStyle();

    // Activate dark mode
    initDarkMode();

    setCopyrightYear();
    new MobileMenuManager();
    preloadHeroImages();
    new NavbarScrollManager();
    new SmoothScrollManager();
    new MobileTrackLinkManager();
    new PartnersCarouselManager();
    new FormSubmissionManager();
    new ServiceWorkerManager();
    new HeroSliderManager();
    new ScrollRevealManager();
    initVideoOptimization();
    initTeamCardExpansion();
  };

  function initVideoOptimization() {
    const video = document.querySelector('.services-bg-video');
    const section = document.querySelector('.video-services-section');
    const source = video?.querySelector('source[data-src]');
    if (!video || !section || !source) return;

    const isMobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
    let sourceLoaded = false;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('autoplay', '');
    video.preload = isMobile ? 'metadata' : 'auto';

    const markVideoPlaying = () => {
      section.classList.add('video-playing');
    };

    const markVideoIdle = () => {
      section.classList.remove('video-playing');
    };

    const loadVideoSource = () => {
      if (sourceLoaded) return;
      source.src = source.dataset.src;
      video.load();
      sourceLoaded = true;
    };

    const attemptVideoPlay = () => {
      loadVideoSource();
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          markVideoIdle();
        });
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          attemptVideoPlay();
        } else {
          video.pause();
          markVideoIdle();
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: isMobile ? '180px 0px' : '280px 0px'
    });

    observer.observe(section);

    video.addEventListener('loadedmetadata', () => {
      video.currentTime = 0;
    });

    video.addEventListener('canplay', attemptVideoPlay, { once: true });
    video.addEventListener('playing', markVideoPlaying);
    video.addEventListener('pause', markVideoIdle);
    video.addEventListener('error', markVideoIdle);
    video.addEventListener('stalled', markVideoIdle);

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        attemptVideoPlay();
      } else {
        video.pause();
        markVideoIdle();
      }
    });

    if (!isMobile) {
      attemptVideoPlay();
    }
  }

  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPage);
  } else {
    initPage();
  }

  // Export for external use
  window.ExpressIT = {
    theme: {
      toggle: () => {
        const html = document.documentElement;
        const nextIsDark = !html.classList.contains("dark-mode");

        html.classList.toggle("dark-mode", nextIsDark);
        html.classList.toggle("dark", nextIsDark);
        document.body.classList.toggle("dark-mode", nextIsDark);
        document.body.classList.toggle("dark", nextIsDark);
        localStorage.setItem("theme", nextIsDark ? "dark" : "light");
      },
      isDark: () => document.documentElement.classList.contains("dark-mode")
    },
    showNotification,
    isValidEmail,
    sanitizeInput
  };

})();
