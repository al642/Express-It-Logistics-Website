/**
 * Express It Logistics Ltd - Main JavaScript
 * Consolidated functionality for all pages
 * Safari-compatible with proper event handling
 */

(function () {
  "use strict";

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
    const yearElements = document.querySelectorAll(".copyright-year");
    yearElements.forEach((el) => {
      el.textContent = "2026";
    });
  };

  // ============================================
  // DARK MODE MANAGER (Singleton)
  // ============================================

  class DarkModeManager {
    constructor() {
      this.storageKey = 'expressit_theme';
      this.systemPreferenceKey = 'expressit_system_preference';
      this.bodyClass = 'dark-mode';
      this.toggleSelectors = ['#dark-mode-toggle', '#dark-mode-toggle-mobile'];
      this.isDark = false;
      this.icons = null;
      this.init();
    }

    init() {
      const savedPreference = localStorage.getItem(this.storageKey);
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;

      if (savedPreference !== null) {
        this.isDark = savedPreference === 'true';
        localStorage.setItem(this.systemPreferenceKey, 'false');
      } else {
        this.isDark = prefersDark;
        localStorage.setItem(this.systemPreferenceKey, 'true');
      }

      this.applyTheme();
      this.updateIcons();
      this.bindEvents();
    }

    bindEvents() {
      // Toggle buttons
      this.toggleSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
          element?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggle();
          });
        });
      });

      // System preference changes
      const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
      if (mediaQuery?.addEventListener) {
        mediaQuery.addEventListener('change', (e) => {
          if (localStorage.getItem(this.systemPreferenceKey) === 'true') {
            this.isDark = e.matches;
            this.applyTheme();
            this.updateIcons();
          }
        });
      }
    }

    toggle() {
      this.isDark = !this.isDark;
      localStorage.setItem(this.storageKey, this.isDark);
      localStorage.setItem(this.systemPreferenceKey, 'false');
      this.applyTheme();
      this.updateIcons();
      this.animateToggle();
    }

    applyTheme() {
      if (this.isDark) {
        document.body.classList.add(this.bodyClass);
      } else {
        document.body.classList.remove(this.bodyClass);
      }
      this.updateThemeColor();
    }

    updateThemeColor() {
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', this.isDark ? '#1a1a2e' : '#e91e63');
      }
    }

    updateIcons() {
      document.querySelectorAll('#dark-mode-toggle i, #dark-mode-toggle-mobile i').forEach(icon => {
        icon.className = this.isDark ? 'fas fa-sun' : 'fas fa-moon';
      });
    }

    animateToggle() {
      document.querySelectorAll('.dark-mode-toggle').forEach(toggle => {
        toggle.style.transform = 'scale(0.9)';
        setTimeout(() => toggle.style.transform = 'scale(1)', 150);
      });
    }

    static isDarkMode() {
      return document.body.classList.contains('dark-mode') || document.body.classList.contains('dark');
    }
  }

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

      if (!this.btn || !this.menu) return;

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
  // NAVBAR SCROLL MANAGER
  // ============================================

  class NavbarScrollManager {
    constructor() {
      this.navbar = document.querySelector(".site-header");
      this.lastScrollY = 0;
      this.ticking = false;
      if (this.navbar) this.init();
    }

    init() {
      window.addEventListener("scroll", () => this.handleScroll(), { passive: true });
    }

    handleScroll() {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          const {scrollY} = window;
          this.navbar?.classList.toggle("scrolled", scrollY > 50);
          this.lastScrollY = scrollY;
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
  // SERVICES CAROUSEL MANAGER
  // ============================================

  class ServicesCarouselManager {
    constructor() {
      this.carousel = document.getElementById('services-carousel');
      this.prevBtn = document.querySelector('.services-carousel-prev');
      this.nextBtn = document.querySelector('.services-carousel-next');
      this.scrollAmount = 0;
      this.maxScroll = 0;
      this.scrollPerClick = 0;
      this.touchStartX = 0;
      this.touchStartScroll = 0;
      this.isMouseDown = false;
      this.mouseStartX = 0;
      this.mouseStartScroll = 0;

      if (this.carousel && this.prevBtn && this.nextBtn) {
        this.init();
      }
    }

    getSlideWidth() {
      const firstSlide = this.carousel.querySelector('.service-slide');
      if (firstSlide) {
        const slideRect = firstSlide.getBoundingClientRect();
        const gap = parseFloat(window.getComputedStyle(this.carousel).gap) || 24;
        return slideRect.width + gap;
      }
      return 344;
    }

    updateMaxScroll() {
      const container = this.carousel.parentElement;
      const containerRect = container.getBoundingClientRect();
      const paddingLeft = parseFloat(window.getComputedStyle(container).paddingLeft) || 0;
      const paddingRight = parseFloat(window.getComputedStyle(container).paddingRight) || 0;
      const visibleWidth = Math.max(0, containerRect.width - paddingLeft - paddingRight);
      this.maxScroll = Math.max(0, this.carousel.scrollWidth - visibleWidth);
      this.scrollPerClick = this.getSlideWidth();
    }

    updateButtons() {
      const tolerance = 5;
      this.prevBtn.disabled = this.scrollAmount <= tolerance;
      this.nextBtn.disabled = this.scrollAmount >= this.maxScroll - tolerance;
    }

    scrollTo(newAmount) {
      this.scrollAmount = Math.max(0, Math.min(newAmount, this.maxScroll));
      this.carousel.style.transform = `translateX(-${this.scrollAmount}px)`;
      this.updateButtons();
    }

    scrollByCard(direction) {
      const delta = direction === 'next' ? this.scrollPerClick : -this.scrollPerClick;
      this.scrollTo(this.scrollAmount + delta);
    }

    init() {
      // Navigation buttons
      this.prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.scrollByCard('prev');
      });
      this.nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.scrollByCard('next');
      });

      // Touch support
      this.carousel.addEventListener('touchstart', (e) => {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartScroll = this.scrollAmount;
        this.carousel.classList.add('dragging');
      }, { passive: true });

      this.carousel.addEventListener('touchmove', (e) => {
        if (!this.carousel.classList.contains('dragging')) return;
        const diff = this.touchStartX - e.touches[0].clientX;
        this.scrollTo(this.touchStartScroll + diff);
      }, { passive: true });

      this.carousel.addEventListener('touchend', () => {
        this.carousel.classList.remove('dragging');
        this.updateButtons();
      }, { passive: true });

      // Mouse drag support
      this.carousel.addEventListener('mousedown', (e) => {
        if (e.target.closest('.services-carousel-btn')) return;
        this.isMouseDown = true;
        this.mouseStartX = e.clientX;
        this.mouseStartScroll = this.scrollAmount;
        this.carousel.classList.add('dragging');
        this.carousel.style.cursor = 'grabbing';
      });

      document.addEventListener('mousemove', (e) => {
        if (!this.isMouseDown) return;
        const diff = this.mouseStartX - e.clientX;
        this.scrollTo(this.mouseStartScroll + diff);
      });

      document.addEventListener('mouseup', () => {
        if (this.isMouseDown) {
          this.isMouseDown = false;
          this.carousel.classList.remove('dragging');
          this.carousel.style.cursor = 'grab';
          this.updateButtons();
        }
      });

      this.carousel.addEventListener('selectstart', (e) => {
        if (this.isMouseDown) e.preventDefault();
      });

      // Keyboard navigation
      this.carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') this.scrollByCard('prev');
        else if (e.key === 'ArrowRight') this.scrollByCard('next');
      });

      this.carousel.setAttribute('tabindex', '0');
      this.carousel.setAttribute('role', 'region');
      this.carousel.setAttribute('aria-label', 'Services carousel');

      // Initialize
      this.updateMaxScroll();
      this.updateButtons();

      // Resize handler
      window.addEventListener('resize', () => {
        this.updateMaxScroll();
        this.scrollAmount = Math.min(this.scrollAmount, this.maxScroll);
        this.carousel.style.transform = `translateX(-${this.scrollAmount}px)`;
        this.updateButtons();
      }, { passive: true });

      window.addEventListener('orientationchange', () => {
        setTimeout(() => {
          this.updateMaxScroll();
          this.scrollAmount = Math.min(this.scrollAmount, this.maxScroll);
          this.carousel.style.transform = `translateX(-${this.scrollAmount}px)`;
          this.updateButtons();
        }, 100);
      });
    }
  }

  // ============================================
  // HERO SLIDER MANAGER
  // ============================================

  class HeroSliderManager {
    constructor() {
      this.slider = document.querySelector('.hero-slider');
      this.slides = document.querySelectorAll('.hero-slider .slide');
      this.prevBtn = document.querySelector('.hero-prev');
      this.nextBtn = document.querySelector('.hero-next');
      this.dotsContainer = document.querySelector('.hero-dots');
      this.current = 0;
      this.interval = null;
      this.autoScrollTime = 5000; // 5 seconds

      if (this.slider && this.slides.length > 0) {
        this.init();
      }
    }

    init() {
      this.createDots();
      this.startAutoScroll();
      this.bindEvents();
    }

    createDots() {
      if (!this.dotsContainer) return;
      
      this.slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'dot' + (index === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => this.goToSlide(index));
        this.dotsContainer.appendChild(dot);
      });
    }

    updateDots() {
      const dots = this.dotsContainer.querySelectorAll('.dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === this.current);
      });
    }

    showSlide(index) {
      this.slides.forEach(slide => slide.classList.remove('active'));
      this.slides[index].classList.add('active');
      this.updateDots();
    }

    nextSlide() {
      this.current = (this.current + 1) % this.slides.length;
      this.showSlide(this.current);
    }

    prevSlide() {
      this.current = (this.current - 1 + this.slides.length) % this.slides.length;
      this.showSlide(this.current);
    }

    goToSlide(index) {
      this.current = index;
      this.showSlide(this.current);
      this.resetTimer();
    }

    startAutoScroll() {
      this.interval = setInterval(() => this.nextSlide(), this.autoScrollTime);
    }

    resetTimer() {
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.startAutoScroll();
    }

    bindEvents() {
      // Previous button
      this.prevBtn?.addEventListener('click', () => {
        this.prevSlide();
        this.resetTimer();
      });

      // Next button
      this.nextBtn?.addEventListener('click', () => {
        this.nextSlide();
        this.resetTimer();
      });

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          this.prevSlide();
          this.resetTimer();
        } else if (e.key === 'ArrowRight') {
          this.nextSlide();
          this.resetTimer();
        }
      });

      // Pause on hover
      this.slider?.addEventListener('mouseenter', () => {
        if (this.interval) {
          clearInterval(this.interval);
        }
      });

      this.slider?.addEventListener('mouseleave', () => {
        this.startAutoScroll();
      });

      // Handle visibility change (pause when tab is hidden)
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (this.interval) {
            clearInterval(this.interval);
          }
        } else {
          this.startAutoScroll();
        }
      });
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
  // HERO SLIDER MANAGER
  // ============================================

  class HeroSliderManager {
    constructor() {
      this.slider = document.querySelector('.hero-section');
      this.slides = document.querySelectorAll('.hero-slider .slide');
      this.dotsContainer = document.querySelector('.hero-dots');
      this.progress = document.querySelector('.hero-progress');
      this.prevBtn = document.querySelector('.hero-prev');
      this.nextBtn = document.querySelector('.hero-next');

      this.current = 0;
      this.slideInterval = null;
      this.slideDuration = 6000;

      if (this.slider && this.slides.length > 0) {
        this.init();
      }
    }

    init() {
      this.createDots();
      this.bindEvents();
      this.startSlider();
    }

    createDots() {
      if (!this.dotsContainer) return;

      this.slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => this.goToSlide(index));
        this.dotsContainer.appendChild(dot);
      });

      this.dots = this.dotsContainer.querySelectorAll('.dot');
    }

    bindEvents() {
      this.prevBtn?.addEventListener('click', () => this.prevSlide());
      this.nextBtn?.addEventListener('click', () => this.nextSlide());

      this.slider?.addEventListener('mouseenter', () => this.pauseSlider());
      this.slider?.addEventListener('mouseleave', () => this.resumeSlider());

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
      this.slides.forEach(slide => slide.classList.remove('active'));
      this.dots?.forEach(dot => dot.classList.remove('active'));

      this.slides[index]?.classList.add('active');
      this.dots?.[index]?.classList.add('active');

      this.restartProgress();
    }

    nextSlide() {
      this.current = (this.current + 1) % this.slides.length;
      this.showSlide(this.current);
    }

    prevSlide() {
      this.current = (this.current - 1 + this.slides.length) % this.slides.length;
      this.showSlide(this.current);
    }

    goToSlide(index) {
      this.current = index;
      this.showSlide(this.current);
    }

    startSlider() {
      this.slideInterval = setInterval(() => this.nextSlide(), this.slideDuration);
      this.restartProgress();
    }

    restartProgress() {
      if (!this.progress) return;

      this.progress.style.transition = 'none';
      this.progress.style.width = '0%';

      void this.progress.offsetWidth;

      setTimeout(() => {
        this.progress.style.transition = `width ${this.slideDuration}ms linear`;
        this.progress.style.width = '100%';
      }, 50);
    }

    pauseSlider() {
      if (this.slideInterval) {
        clearInterval(this.slideInterval);
        this.slideInterval = null;
      }
      if (this.progress) {
        const computedStyle = window.getComputedStyle(this.progress);
        const width = computedStyle.getPropertyValue('width');
        this.progress.style.transition = 'none';
        this.progress.style.width = width;
      }
    }

    resumeSlider() {
      this.startSlider();
    }
  }

  // ============================================
  // INITIALIZATION
  // ====================================

  const init = () => {
    setCopyrightYear();
    window.darkModeManager = new DarkModeManager();
    new MobileMenuManager();
    new NavbarScrollManager();
    new SmoothScrollManager();
    new MobileTrackLinkManager();
    new ServicesCarouselManager();
    new FormSubmissionManager();
    new ServiceWorkerManager();
    new HeroSliderManager();
  };

  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Export for external use
  window.ExpressIT = {
    darkMode: {
      toggle: () => window.darkModeManager?.toggle(),
      isDark: () => DarkModeManager.isDarkMode(),
      updateThemeColor: () => window.darkModeManager?.updateThemeColor()
    },
    showNotification,
    isValidEmail,
    sanitizeInput
  };

})();

