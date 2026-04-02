
/**
 * Smart Header Scroll for Express It Logistics
 * Hide on fast down-scroll, reappear on any up-scroll
 * Mobile + desktop optimized
 */

class SmartHeaderScroll {
  constructor() {
    this.header = document.querySelector('.site-header');
    if (!this.header) {
      setTimeout(() => this.init(), 200);
      return;
    }
    this.init();
  }

  init() {
    this.lastScrollY = window.scrollY;
    this.ticking = false;
    
    // Scroll + wheel for precise delta
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    window.addEventListener('wheel', (e) => this.handleWheel(e), { passive: true });
    
    // Mobile touch delta
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      if (Math.abs(deltaY) > 8) {
        this.scrollDelta = deltaY > 0 ? 15 : -8;
        this.updateHeader();
        touchStartY = touchY;
      }
    }, { passive: true });
  }

  handleWheel(e) {
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
      this.header.classList.remove('hidden');
      return;
    }

    const isMobile = window.innerWidth <= 768;
    const hideThreshold = isMobile ? 15 : 20;
    const showThreshold = isMobile ? 8 : 10;

    if (this.scrollDelta > hideThreshold) {
      this.header.classList.add('scrolled', 'hidden');
    } else if (this.scrollDelta < -showThreshold) {
      this.header.classList.remove('hidden');
      this.header.classList.add('scrolled');
    }
  }
}

// Auto-init when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new SmartHeaderScroll());
} else {
  new SmartHeaderScroll();
}

