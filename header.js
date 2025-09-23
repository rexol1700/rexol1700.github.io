// Mobile sticky navigation
function initMobileStickyNav() {
  const header = document.querySelector('.site-header');
  let lastScrollTop = 0;
  let isScrolled = false;

  // Only apply on mobile
  function isMobile() {
    return window.innerWidth <= 768;
  }

  function handleScroll() {
    if (!isMobile()) {
      // Remove scrolled class on desktop
      if (header.classList.contains('scrolled')) {
        header.classList.remove('scrolled');
      }
      return;
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50 && !isScrolled) {
      header.classList.add('scrolled');
      isScrolled = true;
    } else if (scrollTop <= 50 && isScrolled) {
      header.classList.remove('scrolled');
      isScrolled = false;
    }
  }

  // Throttle scroll events for better performance
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', handleScroll); // Handle orientation changes
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initMobileStickyNav);
