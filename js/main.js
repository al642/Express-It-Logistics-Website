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
      this.storageKey = 'darkMode';
      this.legacyStorageKey = 'expressit_theme';
      this.bodyClass = 'dark-mode';
      this.toggleSelectors = ['#darkModeToggle', '#dark-mode-toggle', '#dark-mode-toggle-mobile'];
      this.isDark = false;
      this.init();
    }

    init() {
      const savedPreference = this.getStoredPreference();
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;

      if (savedPreference === true) {
        this.isDark = true;
      } else if (savedPreference === false) {
        this.isDark = false;
      } else {
        this.isDark = prefersDark;
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
          if (localStorage.getItem(this.storageKey) === null) {
            this.isDark = e.matches;
            this.applyTheme();
            this.updateIcons();
          }
        });
      }
    }

    toggle() {
      this.isDark = !this.isDark;
      this.setStoredPreference(this.isDark);
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
      document.body.classList.remove('dark');
      document.documentElement.style.colorScheme = this.isDark ? 'dark' : 'light';
      this.updateThemeColor();
    }

    updateThemeColor() {
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', this.isDark ? '#0f172a' : '#e63946');
      }
    }

    updateIcons() {
      document.querySelectorAll('#darkModeToggle i, #dark-mode-toggle i, #dark-mode-toggle-mobile i').forEach(icon => {
        icon.className = this.isDark ? 'fas fa-sun' : 'fas fa-moon';
      });
      document.querySelectorAll(this.toggleSelectors.join(', ')).forEach((button) => {
        button.setAttribute('aria-pressed', this.isDark ? 'true' : 'false');
      });
    }

    animateToggle() {
      document.querySelectorAll('.dark-mode-toggle').forEach(toggle => {
        toggle.style.transform = 'scale(0.9)';
        setTimeout(() => toggle.style.transform = 'scale(1)', 150);
      });
    }

    static isDarkMode() {
      return document.body.classList.contains('dark-mode');
    }

    getStoredPreference() {
      try {
        const value = localStorage.getItem(this.storageKey);
        if (value === 'true') return true;
        if (value === 'false') return false;

        const legacyValue = localStorage.getItem(this.legacyStorageKey);
        if (legacyValue === 'dark' || legacyValue === 'true') return true;
        if (legacyValue === 'light' || legacyValue === 'false') return false;

        return null;
      } catch {
        return null;
      }
    }

    setStoredPreference(value) {
      try {
        localStorage.setItem(this.storageKey, String(value));
        localStorage.removeItem(this.legacyStorageKey);
      } catch {
        // Ignore storage failures (private mode/restricted contexts)
      }
    }
  }

  // ============================================
  // MOBILE MENU MANAGER
  // ============================================

  class MobileMenuManager {
    constructor() {
      this.menu = null;
      this.btn = null;
      this.navLinks = null;
      this.isOpen = false;
      this.init();
    }

    init() {
      this.btn = document.getElementById("mobile-menu-btn");
      this.menu = document.getElementById("mobile-menu");
      this.navLinks = document.querySelector(".nav-links");

      if (!this.btn) return;

      // Toggle button
      this.btn.addEventListener("click", () => this.toggle());

      // Close on document click (delegated)
      document.addEventListener("click", (e) => this.handleOutsideClick(e));

      // Close on Escape key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isOpen) this.close();
      });

      // Close on link click
      this.menu?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => this.close());
      });
      this.navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => this.close());
      });
    }

    toggle() {
      this.isOpen = !this.isOpen;
      this.menu?.classList.toggle("open", this.isOpen);
      this.navLinks?.classList.toggle("active", this.isOpen);
      this.btn.classList.toggle("active", this.isOpen);
      this.btn.setAttribute("aria-expanded", this.isOpen);
    }

    close() {
      this.isOpen = false;
      this.menu?.classList.remove("open");
      this.navLinks?.classList.remove("active");
      this.btn?.classList.remove("active");
      this.btn?.setAttribute("aria-expanded", "false");
    }

    handleOutsideClick(e) {
      const clickedInsideMenu = this.menu?.contains(e.target) ?? false;
      const clickedInsideNavLinks = this.navLinks?.contains(e.target) ?? false;
      if (this.isOpen && !clickedInsideMenu && !clickedInsideNavLinks && !this.btn.contains(e.target)) {
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
          const scrollY = window.scrollY;
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
  // ============================================

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
