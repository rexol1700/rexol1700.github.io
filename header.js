class NavigationController {
  constructor() {
    this.header = document.querySelector('.site-header');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('section');
    
    // Configuration
    this.config = {
      mobileBreakpoint: 768,
      scrollThreshold: 50,
      scrollOffset: 100,
      throttleDelay: 16 // ~60fps
    };
    
    // State
    this.state = {
      lastScrollTop: 0,
      isScrolled: false,
      ticking: false,
      rafId: null
    };
    
    // Bind methods
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleNavClick = this.handleNavClick.bind(this);
    
    this.init();
  }
  
  init() {
    if (!this.header) {
      console.warn('NavigationController: No header element found');
      return;
    }
    
    this.setupEventListeners();
    this.updateActiveNavLink(); // Set initial active state
  }
  
  setupEventListeners() {
    // Use passive listeners for better scroll performance
    window.addEventListener('scroll', this.throttledScroll.bind(this), { passive: true });
    window.addEventListener('resize', this.debounce(this.handleResize, 250));
    
    this.navLinks.forEach(link => {
      link.addEventListener('click', this.handleNavClick);
    });
  }
  
  // Utilities
  isMobile() {
    return window.innerWidth <= this.config.mobileBreakpoint;
  }
  
  getHeaderHeight() {
    return this.header?.offsetHeight || 0;
  }
  
  throttledScroll() {
    if (!this.state.ticking) {
      this.state.rafId = requestAnimationFrame(() => {
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
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
  
  // Sticky header logic
  handleScroll() {
    if (!this.isMobile()) {
      this.header.classList.remove('scrolled');
      this.state.isScrolled = false;
      return;
    }
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > this.config.scrollThreshold && !this.state.isScrolled) {
      this.header.classList.add('scrolled');
      this.state.isScrolled = true;
    } else if (scrollTop <= this.config.scrollThreshold && this.state.isScrolled) {
      this.header.classList.remove('scrolled');
      this.state.isScrolled = false;
    }
    
    this.state.lastScrollTop = scrollTop;
  }
  
  handleResize() {
    this.handleScroll();
  }
  
  // Smooth scroll navigation
  handleNavClick(e) {
    const link = e.currentTarget;
    const href = link.getAttribute('href');
    
    // Only handle hash links
    if (!href || !href.startsWith('#')) return;
    
    e.preventDefault();
    
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (!targetElement) {
      console.warn(`NavigationController: Target element #${targetId} not found`);
      return;
    }
    
    this.scrollToElement(targetElement);
    this.setActiveLink(link);
    
    // Update URL without triggering scroll
    history.pushState(null, null, href);
  }
  
  scrollToElement(element) {
    const headerHeight = this.getHeaderHeight();
    const targetPosition = element.offsetTop - headerHeight;
    
    // Use native smooth scroll with fallback
    try {
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    } catch (e) {
      // Fallback for older browsers
      window.scrollTo(0, targetPosition);
    }
  }
  
  setActiveLink(activeLink) {
    this.navLinks.forEach(link => {
      link.classList.toggle('active', link === activeLink);
    });
  }
  
  updateActiveNavLink() {
    if (!this.sections.length || !this.navLinks.length) return;
    
    const headerHeight = this.getHeaderHeight();
    const scrollPosition = window.scrollY + headerHeight + this.config.scrollOffset;
    
    let currentSection = null;
    
    // Find current section (iterate backwards for correct detection)
    for (let i = this.sections.length - 1; i >= 0; i--) {
      const section = this.sections[i];
      if (scrollPosition >= section.offsetTop) {
        currentSection = section.getAttribute('id');
        break;
      }
    }
    
    // Update active states
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const isActive = href === `#${currentSection}`;
      link.classList.toggle('active', isActive);
      
      // Update ARIA attribute for accessibility
      link.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  }
  
  // Cleanup method
  destroy() {
    if (this.state.rafId) {
      cancelAnimationFrame(this.state.rafId);
    }
    
    window.removeEventListener('scroll', this.throttledScroll);
    window.removeEventListener('resize', this.handleResize);
    
    this.navLinks.forEach(link => {
      link.removeEventListener('click', this.handleNavClick);
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.navigationController = new NavigationController();
  });
} else {
  // DOM already loaded
  window.navigationController = new NavigationController();
}
