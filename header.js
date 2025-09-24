class NavigationController {
  constructor() {
    this.header = document.querySelector('.site-header');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('section');
    
    // Configuration
    this.config = {
      mobileBreakpoint: 768,
      scrollThreshold: 50,
      activeOffset: 0.3, // 30% of viewport height for better mobile detection
      throttleDelay: 16
    };
    
    // State
    this.state = {
      isScrolled: false,
      ticking: false,
      currentSection: null
    };
    
    this.init();
  }
  
  init() {
    if (!this.header) {
      console.warn('NavigationController: No header element found');
      return;
    }
    
    this.setupEventListeners();
    // Initial check
    this.handleScroll();
    this.updateActiveNavLink();
  }
  
  setupEventListeners() {
    // Combined scroll handler for both sticky nav and active link updates
    window.addEventListener('scroll', () => this.throttledScroll(), { passive: true });
    window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));
    
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleNavClick(e));
    });
    
    // Also update on load and orientation change (important for mobile)
    window.addEventListener('load', () => this.updateActiveNavLink());
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.updateActiveNavLink(), 100);
    });
  }
  
  isMobile() {
    return window.innerWidth <= this.config.mobileBreakpoint;
  }
  
  getHeaderHeight() {
    return this.header?.offsetHeight || 0;
  }
  
  throttledScroll() {
    if (!this.state.ticking) {
      requestAnimationFrame(() => {
        this.handleScroll();
        this.updateActiveNavLink();
        this.state.ticking = false;
      });
      this.state.ticking = true;
    }
  }
  
  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }
  
  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Mobile sticky header
    if (this.isMobile()) {
      if (scrollTop > this.config.scrollThreshold && !this.state.isScrolled) {
        this.header.classList.add('scrolled');
        this.state.isScrolled = true;
      } else if (scrollTop <= this.config.scrollThreshold && this.state.isScrolled) {
        this.header.classList.remove('scrolled');
        this.state.isScrolled = false;
      }
    } else {
      // Desktop - remove scrolled class
      this.header.classList.remove('scrolled');
      this.state.isScrolled = false;
    }
  }
  
  handleResize() {
    this.handleScroll();
    this.updateActiveNavLink();
  }
  
  handleNavClick(e) {
    const link = e.currentTarget;
    const href = link.getAttribute('href');
    
    if (!href || !href.startsWith('#')) return;
    
    e.preventDefault();
    
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (!targetElement) return;
    
    this.scrollToElement(targetElement);
    
    // Immediately set active state
    this.setActiveLink(link);
    
    // Update URL
    history.pushState(null, null, href);
    
    // Close mobile menu if it exists
    if (this.isMobile()) {
      const mobileMenu = document.querySelector('.mobile-menu');
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
      }
    }
  }
  
  scrollToElement(element) {
    const headerHeight = this.getHeaderHeight();
    const targetPosition = element.offsetTop - headerHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
  
  setActiveLink(activeLink) {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      link.setAttribute('aria-current', 'false');
    });
    
    activeLink.classList.add('active');
    activeLink.setAttribute('aria-current', 'page');
  }
  
  updateActiveNavLink() {
    if (!this.sections.length || !this.navLinks.length) return;
    
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const headerHeight = this.getHeaderHeight();
    
    // Calculate the trigger point (adjustable based on viewport)
    const triggerPoint = scrollPosition + (windowHeight * this.config.activeOffset) + headerHeight;
    
    let currentSection = null;
    
    // Check if we're at the bottom of the page
    const isAtBottom = (window.innerHeight + scrollPosition) >= document.documentElement.scrollHeight - 10;
    
    if (isAtBottom && this.sections.length > 0) {
      // If at bottom, activate the last section
      currentSection = this.sections[this.sections.length - 1].getAttribute('id');
    } else {
      // Find the current section based on scroll position
      for (let i = 0; i < this.sections.length; i++) {
        const section = this.sections[i];
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        // Check if the trigger point is within this section
        if (triggerPoint >= sectionTop && triggerPoint < sectionBottom) {
          currentSection = section.getAttribute('id');
          break;
        }
      }
      
      // If no section found and we're near the top, activate the first section
      if (!currentSection && scrollPosition < 100 && this.sections.length > 0) {
        currentSection = this.sections[0].getAttribute('id');
      }
    }
    
    // Only update if section changed
    if (currentSection !== this.state.currentSection) {
      this.state.currentSection = currentSection;
      
      // Update active states
      this.navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const isActive = currentSection && href === `#${currentSection}`;
        
        link.classList.toggle('active', isActive);
        link.setAttribute('aria-current', isActive ? 'page' : 'false');
      });
      
      // Debug log for mobile testing
      if (this.isMobile()) {
        console.log('Active section:', currentSection);
      }
    }
  }
  
  destroy() {
    window.removeEventListener('scroll', this.throttledScroll);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('load', this.updateActiveNavLink);
    window.removeEventListener('orientationchange', this.updateActiveNavLink);
    
    this.navLinks.forEach(link => {
      link.removeEventListener('click', this.handleNavClick);
    });
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.navigationController = new NavigationController();
  });
} else {
  window.navigationController = new NavigationController();
}
